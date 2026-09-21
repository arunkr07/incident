package com.incident.detection.dto;

import com.incident.detection.*;
import com.incident.incident.IncidentSeverity;

public record DetectionRuleResponse(

        Long id,

        Long serviceId,
        String serviceName,

        String name,

        DetectionMetricType metricType,
        DetectionOperator operator,

        Double threshold,

        IncidentSeverity severity,

        Boolean enabled,

        Integer evaluationWindowSeconds

) {

    public static DetectionRuleResponse from(
            DetectionRule rule
    ) {

        return new DetectionRuleResponse(
                rule.getId(),

                rule.getService().getId(),
                rule.getService().getName(),

                rule.getName(),

                rule.getMetricType(),
                rule.getOperator(),

                rule.getThreshold(),

                rule.getSeverity(),

                rule.getEnabled(),

                rule.getEvaluationWindowSeconds()
        );
    }
}