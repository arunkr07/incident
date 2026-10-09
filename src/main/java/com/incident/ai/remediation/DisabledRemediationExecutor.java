
package com.incident.ai.remediation;

import org.springframework.stereotype.Component;

@Component
public class DisabledRemediationExecutor
        implements RemediationExecutor {

    @Override
    public RemediationExecutionResult execute(
            Remediation remediation
    ) {
        return RemediationExecutionResult.failure(
                "Execution is disabled: no production remediation "
                        + "integration is configured. No action was performed."
        );
    }
}
