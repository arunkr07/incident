package com.incident.metric.dto;

import com.incident.metric.Metric;

import java.time.LocalDateTime;

public record MetricResponse(

        Long id,
        Long serviceId,
        String serviceName,
        String metricType,
        Double metricValue,
        LocalDateTime recordedAt

) {

    public static MetricResponse from(Metric metric) {

        return new MetricResponse(
                metric.getId(),
                metric.getService().getId(),
                metric.getService().getName(),
                metric.getMetricType(),
                metric.getMetricValue(),
                metric.getRecordedAt()
        );
    }
}