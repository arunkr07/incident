package com.incident.ai.remediation;

public interface RemediationExecutor {

    RemediationExecutionResult execute(
            Remediation remediation
    );
}