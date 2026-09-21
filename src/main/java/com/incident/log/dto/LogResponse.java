package com.incident.log.dto;

import com.incident.log.Log;
import com.incident.log.LogLevel;

import java.time.LocalDateTime;

public record LogResponse(

        Long id,
        Long serviceId,
        String serviceName,
        LogLevel level,
        String message,
        LocalDateTime timestamp,
        String traceId,
        String requestId

) {

    public static LogResponse from(Log log) {

        return new LogResponse(
                log.getId(),
                log.getService().getId(),
                log.getService().getName(),
                log.getLevel(),
                log.getMessage(),
                log.getTimestamp(),
                log.getTraceId(),
                log.getRequestId()
        );
    }
}