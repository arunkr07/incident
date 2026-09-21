package com.incident.incident.dto;

import com.incident.incident.IncidentTimeline;

import java.time.LocalDateTime;

public record IncidentTimelineResponse(

        Long id,
        String eventType,
        String message,
        LocalDateTime createdAt

) {

    public static IncidentTimelineResponse from(
            IncidentTimeline event
    ) {

        return new IncidentTimelineResponse(
                event.getId(),
                event.getEventType(),
                event.getMessage(),
                event.getCreatedAt()
        );
    }
}