package com.incident.incident.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record IncidentEvent(

        UUID eventId,

        EventType eventType,

        Long incidentId,

        String incidentKey,

        Long serviceId,

        String serviceName,

        String severity,

        String status,

        String source,

        String title,

        LocalDateTime occurredAt

) {}