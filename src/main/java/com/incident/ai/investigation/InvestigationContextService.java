package com.incident.ai.investigation;

import com.incident.ai.investigation.dto.InvestigationContext;
import com.incident.incident.Incident;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class InvestigationContextService {
    private final InvestigationContextProvider contextProvider;

    public InvestigationContextService(InvestigationContextProvider contextProvider) {
        this.contextProvider = contextProvider;
    }

    public InvestigationContext collect(Incident incident) {
        return contextProvider.buildContext(incident);
    }

    public InvestigationContext collect(Incident incident, Map<String, Object> preferences) {
        InvestigationContext context = contextProvider.buildContext(incident);
        boolean includeLogs = enabled(preferences, "includeLogs", true);
        boolean includeMetrics = enabled(preferences, "includeMetrics", true);
        boolean includeDeployments = enabled(preferences, "includeDeployments", true);
        boolean includeDependencies = enabled(preferences, "includeDependencies", true);
        return new InvestigationContext(
                context.incidentId(), context.incidentTitle(), context.incidentDescription(),
                context.severity(), context.status(), context.source(), context.serviceId(),
                context.serviceName(), context.timeline(),
                includeMetrics ? context.metrics() : List.of(),
                includeLogs ? context.logs() : List.of(),
                includeDeployments ? context.deployments() : List.of(),
                includeDependencies ? context.dependencies() : List.of(),
                context.previousIncidents()
        );
    }

    private boolean enabled(Map<String, Object> preferences, String key, boolean defaultValue) {
        if (preferences == null || !preferences.containsKey(key)) return defaultValue;
        return Boolean.TRUE.equals(preferences.get(key));
    }
}
