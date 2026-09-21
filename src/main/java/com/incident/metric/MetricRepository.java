package com.incident.metric;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MetricRepository
        extends JpaRepository<Metric, Long> {

    List<Metric> findByServiceIdAndMetricTypeOrderByRecordedAtDesc(
            Long serviceId,
            String metricType
    );

    List<Metric> findByServiceIdAndMetricTypeAndRecordedAtBetweenOrderByRecordedAtAsc(
            Long serviceId,
            String metricType,
            LocalDateTime from,
            LocalDateTime to
    );

    List<Metric> findByServiceIdAndRecordedAtAfterOrderByRecordedAtDesc(
            Long serviceId,
            LocalDateTime from
    );
}