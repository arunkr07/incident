package com.incident.incident.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record DetectionEvent(

        UUID eventId,

        EventType eventType,

        Long ruleId,

        String ruleName,

        Long serviceId,

        String serviceName,

        String metricType,

        String operator,

        Double threshold,

        Double actualValue,

        String severity,

        LocalDateTime occurredAt

) {}