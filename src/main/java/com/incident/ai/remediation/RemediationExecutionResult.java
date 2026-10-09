package com.incident.ai.remediation;

public record RemediationExecutionResult(

        boolean successful,

        String message,

        String failureReason
) {

    public static RemediationExecutionResult success(
            String message
    ) {

        return new RemediationExecutionResult(
                true,
                message,
                null
        );
    }

    public static RemediationExecutionResult failure(
            String reason
    ) {

        return new RemediationExecutionResult(
                false,
                null,
                reason
        );
    }
}