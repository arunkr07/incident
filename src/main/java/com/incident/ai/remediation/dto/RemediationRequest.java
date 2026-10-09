package com.incident.ai.remediation.dto;

import com.incident.ai.remediation.RemediationType;

public record RemediationRequest(

        RemediationType type,

        Long serviceId,

        String reason,

        String risk,

        String parameters
) {
}