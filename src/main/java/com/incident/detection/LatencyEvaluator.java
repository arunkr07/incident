package com.incident.detection;

import com.incident.metric.Metric;
import com.incident.metric.MetricRepository;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class LatencyEvaluator {

    private final MetricRepository metricRepository;

    public LatencyEvaluator(
            MetricRepository metricRepository
    ) {
        this.metricRepository = metricRepository;
    }

    public Optional<Metric> latest(
            Long serviceId,
            int windowSeconds
    ) {

        LocalDateTime from =
                LocalDateTime.now()
                        .minusSeconds(windowSeconds);

        List<Metric> metrics =
                metricRepository
                        .findByServiceIdAndMetricTypeAndRecordedAtBetweenOrderByRecordedAtAsc(
                                serviceId,
                                "LATENCY",
                                from,
                                LocalDateTime.now()
                        );

        if (metrics.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(
                metrics.get(metrics.size() - 1)
        );
    }
}