package com.incident.incident.dto;

import com.incident.incident.IncidentSeverity;
import com.incident.incident.IncidentSource;
import com.incident.incident.IncidentStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IncidentRequest(

        @NotBlank
        @Size(max = 255)
        String title,

        @Size(max = 5000)
        String description,

        @NotNull
        IncidentSeverity severity,

        IncidentStatus status,

        IncidentSource source,

        @NotNull
        Long serviceId
) {
}