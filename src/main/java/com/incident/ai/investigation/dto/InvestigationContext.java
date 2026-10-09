package com.incident.ai.investigation.dto;

import java.util.List;

public record InvestigationContext(

        Long incidentId,

        String incidentTitle,

        String incidentDescription,

        String severity,

        String status,

        String source,

        Long serviceId,

        String serviceName,

        List<String> timeline,

        List<String> metrics,

        List<String> logs,

        List<String> deployments,

        List<String> dependencies,

        List<String> previousIncidents
) {
}