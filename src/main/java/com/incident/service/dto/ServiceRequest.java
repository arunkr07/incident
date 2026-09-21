package com.incident.service.dto;

import com.incident.service.ServiceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ServiceRequest(

        @NotBlank
        @Size(max = 150)
        String name,

        @Size(max = 500)
        String description,

        ServiceStatus status,

        @Size(max = 50)
        String environment,

        @Size(max = 500)
        String endpoint
) {
}