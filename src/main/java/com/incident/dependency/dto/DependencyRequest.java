package com.incident.dependency.dto;

import jakarta.validation.constraints.NotNull;

public record DependencyRequest(

        @NotNull
        Long sourceServiceId,

        @NotNull
        Long targetServiceId,

        String dependencyType

) {
}