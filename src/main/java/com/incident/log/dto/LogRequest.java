package com.incident.log.dto;

import com.incident.log.LogLevel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record LogRequest(

        @NotNull
        Long serviceId,

        @NotNull
        LogLevel level,

        @NotBlank
        String message,

        LocalDateTime timestamp,

        String traceId,

        String requestId

) {
}