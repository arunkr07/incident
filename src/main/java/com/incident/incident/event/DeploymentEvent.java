package com.incident.incident.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record DeploymentEvent(

        UUID eventId,

        EventType eventType,

        Long deploymentId,

        Long serviceId,

        String serviceName,

        String version,

        String status,

        LocalDateTime occurredAt

) {}