package com.incident.ai.investigation;

import com.incident.ai.investigation.dto.InvestigationContext;
import org.springframework.stereotype.Component;

@Component
public class InvestigationPromptBuilder {

    public String build(
            InvestigationContext context
    ) {

        return """
                You are an AI production incident investigator.

                Your job is to investigate a real software production
                incident using ONLY the evidence supplied below.

                RULES:

                1. Do not invent logs, metrics, deployments, dependencies,
                   or events.

                2. Do not claim certainty when the evidence is incomplete.

                3. Confidence must represent how strongly the supplied
                   evidence supports the root-cause hypothesis.

                4. Distinguish correlation from causation.

                5. Prefer concrete evidence over generic troubleshooting.

                6. If the evidence is insufficient, explicitly say so and
                   provide useful follow-up questions.

                7. Recommended actions must be operationally reasonable.

                8. Never assume that an action has already been executed.

                INCIDENT

                ID:
                %s

                TITLE:
                %s

                DESCRIPTION:
                %s

                SEVERITY:
                %s

                STATUS:
                %s

                SOURCE:
                %s

                SERVICE

                ID:
                %s

                NAME:
                %s

                TIMELINE

                %s

                METRICS

                %s

                LOGS

                %s

                RECENT DEPLOYMENTS

                %s

                DEPENDENCIES

                %s

                PREVIOUS INCIDENTS

                %s

                Analyze the incident and return the required structured
                investigation result.
                """.formatted(
                context.incidentId(),
                safe(context.incidentTitle()),
                safe(context.incidentDescription()),
                safe(context.severity()),
                safe(context.status()),
                safe(context.source()),
                context.serviceId(),
                safe(context.serviceName()),
                format(context.timeline()),
                format(context.metrics()),
                format(context.logs()),
                format(context.deployments()),
                format(context.dependencies()),
                format(context.previousIncidents())
        );
    }

    private String safe(String value) {
        return value == null ? "N/A" : value;
    }

    private String format(
            Iterable<String> values
    ) {

        if (values == null) {
            return "N/A";
        }

        StringBuilder builder = new StringBuilder();

        for (String value : values) {
            builder
                    .append("- ")
                    .append(value)
                    .append("\n");
        }

        return builder.length() == 0
                ? "N/A"
                : builder.toString();
    }
}