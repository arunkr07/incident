package com.incident.incident.event;

import com.incident.incident.Incident;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class IncidentEventFactory {

    public IncidentEvent create(
            Incident incident,
            EventType eventType
    ) {

        return new IncidentEvent(
                UUID.randomUUID(),
                eventType,
                incident.getId(),
                incident.getIncidentKey(),
                incident.getService().getId(),
                incident.getService().getName(),
                incident.getSeverity().name(),
                incident.getStatus().name(),
                incident.getSource().name(),
                incident.getTitle(),
                LocalDateTime.now()
        );
    }
}