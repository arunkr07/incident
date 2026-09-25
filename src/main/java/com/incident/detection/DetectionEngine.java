package com.incident.detection;

import com.incident.incident.Incident;
import com.incident.incident.IncidentService;
import com.incident.incident.IncidentSource;
import com.incident.incident.cache.IncidentDeduplicationService;
import com.incident.incident.event.DetectionEvent;
import com.incident.incident.event.EventType;
import com.incident.incident.event.IncidentEventFactory;
import com.incident.incident.event.KafkaEventPublisher;
import com.incident.metric.Metric;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DetectionEngine {

    private final DetectionRuleRepository ruleRepository;
    private final SignalEvaluator signalEvaluator;
    private final ErrorRateEvaluator errorRateEvaluator;
    private final LatencyEvaluator latencyEvaluator;
    private final IncidentService incidentService;
    private final IncidentDeduplicationService deduplicationService;
    private final KafkaEventPublisher eventPublisher;
    private final IncidentEventFactory eventFactory;

    @Transactional
    public void evaluateRules() {

        List<DetectionRule> rules =
                ruleRepository.findByEnabledTrue();

        for (DetectionRule rule : rules) {
            evaluateRule(rule);
        }
    }

    private void evaluateRule(DetectionRule rule) {

        Long serviceId = rule.getService().getId();

        /*
         * Fast Redis deduplication check.
         *
         * If this service already has an active incident,
         * skip the current detection cycle.
         */
        if (deduplicationService.isActive(serviceId)) {
            return;
        }

        Optional<Metric> latestMetric;

        /*
         * Get the latest metric using the existing
         * Phase 4 evaluator implementation.
         */
        switch (rule.getMetricType()) {

            case ERROR_RATE -> {
                latestMetric =
                        errorRateEvaluator.latest(
                                serviceId,
                                rule.getEvaluationWindowSeconds()
                        );
            }

            case LATENCY -> {
                latestMetric =
                        latencyEvaluator.latest(
                                serviceId,
                                rule.getEvaluationWindowSeconds()
                        );
            }

            default -> {
                return;
            }
        }

        if (latestMetric.isEmpty()) {
            return;
        }

        Metric metric = latestMetric.get();

        /*
         * Evaluate the latest metric against the
         * detection rule.
         */
        boolean triggered =
                signalEvaluator.evaluate(
                        metric.getMetricValue(),
                        rule.getOperator(),
                        rule.getThreshold()
                );

        if (!triggered) {
            return;
        }

        /*
         * Claim the Redis deduplication key before
         * attempting to create the incident.
         */
        boolean claimed =
                deduplicationService.claim(serviceId);

        if (!claimed) {
            return;
        }

        IncidentSource source;

        if (rule.getMetricType()
                == DetectionMetricType.ERROR_RATE) {

            source = IncidentSource.ERROR_RATE;

        } else {

            source = IncidentSource.LATENCY;
        }

        String title =
                rule.getService().getName()
                        + " - "
                        + rule.getName();

        String description =
                "Detection rule '"
                        + rule.getName()
                        + "' was violated. "
                        + "Observed value: "
                        + metric.getMetricValue()
                        + ", threshold: "
                        + rule.getThreshold()
                        + ".";

        /*
         * IncidentService remains responsible for the
         * MySQL active-incident verification.
         */
        Incident saved =
                incidentService.createDetectedIncident(
                        rule.getService(),
                        title,
                        description,
                        rule.getSeverity(),
                        source
                );

        /*
         * Redis was claimed but MySQL determined that
         * an active incident already exists.
         *
         * Release the Redis key.
         */
        if (saved == null) {

            deduplicationService.clear(serviceId);

            return;
        }

        /*
         * detection.triggered
         */
        eventPublisher.publishDetectionTriggered(
                new DetectionEvent(
                        UUID.randomUUID(),
                        EventType.DETECTION_TRIGGERED,
                        rule.getId(),
                        rule.getName(),
                        serviceId,
                        rule.getService().getName(),
                        rule.getMetricType().name(),
                        rule.getOperator().name(),
                        rule.getThreshold(),
                        metric.getMetricValue(),
                        rule.getSeverity().name(),
                        LocalDateTime.now()
                )
        );

        /*
         * incident.created
         */
        eventPublisher.publishIncidentCreated(
                eventFactory.create(
                        saved,
                        EventType.INCIDENT_CREATED
                )
        );
    }
}