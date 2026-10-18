package com.incident.detection.dto;

import com.incident.detection.DetectionMetricType;
import com.incident.detection.DetectionOperator;
import com.incident.incident.IncidentSeverity;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record DetectionRuleUpdateRequest(

        @Size(max = 150)
        String name,

        DetectionMetricType metricType,

        DetectionOperator operator,

        @PositiveOrZero
        Double threshold,

        IncidentSeverity severity,

        Boolean enabled,

        @Positive
        Integer evaluationWindowSeconds
) {
}