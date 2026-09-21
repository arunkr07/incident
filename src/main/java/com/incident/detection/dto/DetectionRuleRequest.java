package com.incident.detection.dto;

import com.incident.detection.*;
import com.incident.incident.IncidentSeverity;

import jakarta.validation.constraints.*;

public record DetectionRuleRequest(

        @NotNull
        Long serviceId,

        @NotBlank
        @Size(max = 150)
        String name,

        @NotNull
        DetectionMetricType metricType,

        @NotNull
        DetectionOperator operator,

        @NotNull
        @Positive
        Double threshold,

        @NotNull
        IncidentSeverity severity,

        Boolean enabled,

        @Positive
        Integer evaluationWindowSeconds

) {
}