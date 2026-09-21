package com.incident.detection;

import com.incident.incident.*;
import com.incident.metric.Metric;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DetectionEngine {

    private final DetectionRuleRepository ruleRepository;
    private final SignalEvaluator signalEvaluator;
    private final ErrorRateEvaluator errorRateEvaluator;
    private final LatencyEvaluator latencyEvaluator;
    private final IncidentService incidentService;

    public DetectionEngine(
            DetectionRuleRepository ruleRepository,
            SignalEvaluator signalEvaluator,
            ErrorRateEvaluator errorRateEvaluator,
            LatencyEvaluator latencyEvaluator,
            IncidentService incidentService
    ) {
        this.ruleRepository = ruleRepository;
        this.signalEvaluator = signalEvaluator;
        this.errorRateEvaluator = errorRateEvaluator;
        this.latencyEvaluator = latencyEvaluator;
        this.incidentService = incidentService;
    }

    @Transactional
    public void evaluateAllRules() {

        List<DetectionRule> rules =
                ruleRepository.findByEnabledTrue();

        for (DetectionRule rule : rules) {

            evaluateRule(rule);
        }
    }

    private void evaluateRule(
            DetectionRule rule
    ) {

        Optional<Metric> latestMetric;

        switch (rule.getMetricType()) {

            case ERROR_RATE -> {

                latestMetric =
                        errorRateEvaluator.latest(
                                rule.getService().getId(),
                                rule.getEvaluationWindowSeconds()
                        );
            }

            case LATENCY -> {

                latestMetric =
                        latencyEvaluator.latest(
                                rule.getService().getId(),
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

        boolean violated =
                signalEvaluator.evaluate(
                        metric.getMetricValue(),
                        rule.getOperator(),
                        rule.getThreshold()
                );

        if (!violated) {
            return;
        }

        createIncident(rule, metric);
    }

    private void createIncident(
            DetectionRule rule,
            Metric metric
    ) {

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

        IncidentSource source;

        if (rule.getMetricType()
                == DetectionMetricType.ERROR_RATE) {

            source = IncidentSource.ERROR_RATE;

        } else {

            source = IncidentSource.LATENCY;
        }

        incidentService.createDetectedIncident(
                rule.getService(),
                title,
                description,
                rule.getSeverity(),
                source
        );
    }
}