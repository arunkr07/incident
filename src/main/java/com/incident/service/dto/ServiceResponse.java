package com.incident.service.dto;

import com.incident.service.Service;
import com.incident.service.ServiceStatus;

import java.time.LocalDateTime;

public record ServiceResponse(
        Long id,
        String name,
        String description,
        ServiceStatus status,
        String environment,
        String endpoint,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static ServiceResponse from(Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getStatus(),
                service.getEnvironment(),
                service.getEndpoint(),
                service.getCreatedAt(),
                service.getUpdatedAt()
        );
    }
}