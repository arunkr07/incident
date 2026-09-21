package com.incident.deployment.dto;

import com.incident.deployment.DeploymentStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DeploymentRequest(

        @NotNull
        Long serviceId,

        @NotBlank
        String version,

        DeploymentStatus status,

        String description

) {
}