package com.incident.deployment.dto;

import com.incident.deployment.*;

import java.time.LocalDateTime;

public record DeploymentResponse(

        Long id,
        Long serviceId,
        String serviceName,
        String version,
        DeploymentStatus status,
        String description,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        LocalDateTime createdAt

) {

    public static DeploymentResponse from(
            Deployment deployment
    ) {

        return new DeploymentResponse(
                deployment.getId(),
                deployment.getService().getId(),
                deployment.getService().getName(),
                deployment.getVersion(),
                deployment.getStatus(),
                deployment.getDescription(),
                deployment.getStartedAt(),
                deployment.getCompletedAt(),
                deployment.getCreatedAt()
        );
    }
}