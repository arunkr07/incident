package com.incident.ai.remediation.dto;

import com.incident.ai.remediation.Remediation;
import com.incident.ai.remediation.RemediationStatus;
import com.incident.ai.remediation.RemediationType;

import java.time.LocalDateTime;

public record RemediationResponse(

        Long id,

        Long incidentId,

        Long serviceId,

        RemediationType type,

        RemediationStatus status,

        String reason,

        String risk,

        String parameters,

        LocalDateTime createdAt,

        LocalDateTime approvedAt,

        LocalDateTime executedAt,

        LocalDateTime completedAt,

        String executionMessage,

        String failureReason
) {

    public static RemediationResponse from(
            Remediation remediation
    ) {

        return new RemediationResponse(
                remediation.getId(),
                remediation.getIncident().getId(),
                remediation.getService().getId(),
                remediation.getType(),
                remediation.getStatus(),
                remediation.getReason(),
                remediation.getRisk(),
                remediation.getParameters(),
                remediation.getCreatedAt(),
                remediation.getApprovedAt(),
                remediation.getExecutedAt(),
                remediation.getCompletedAt(),
                remediation.getExecutionMessage(),
                remediation.getFailureReason()
        );
    }
}