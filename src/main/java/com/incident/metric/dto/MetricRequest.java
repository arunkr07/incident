package com.incident.metric.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record MetricRequest(

        @NotNull
        Long serviceId,

        @NotBlank
        String metricType,

        @NotNull
        Double metricValue,

        LocalDateTime recordedAt

) {
}