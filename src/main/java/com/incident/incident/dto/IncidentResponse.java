package com.incident.incident.dto;

import com.incident.incident.*;

import java.time.LocalDateTime;

public record IncidentResponse(

        Long id,
        String title,
        String description,
        IncidentSeverity severity,
        IncidentStatus status,
        IncidentSource source,

        Long serviceId,
        String serviceName,

        LocalDateTime startedAt,
        LocalDateTime acknowledgedAt,
        LocalDateTime resolvedAt,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static IncidentResponse from(Incident incident) {

        return new IncidentResponse(
                incident.getId(),
                incident.getTitle(),
                incident.getDescription(),
                incident.getSeverity(),
                incident.getStatus(),
                incident.getSource(),
                incident.getService().getId(),
                incident.getService().getName(),
                incident.getStartedAt(),
                incident.getAcknowledgedAt(),
                incident.getResolvedAt(),
                incident.getCreatedAt(),
                incident.getUpdatedAt()
        );
    }
}