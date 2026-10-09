package com.incident.ai.investigation;

import com.incident.ai.investigation.dto.InvestigationContext;
import com.incident.incident.Incident;
import org.springframework.stereotype.Service;

@Service
public class InvestigationContextService {

    private final InvestigationContextProvider contextProvider;

    public InvestigationContextService(
            InvestigationContextProvider contextProvider
    ) {
        this.contextProvider = contextProvider;
    }

    public InvestigationContext collect(
            Incident incident
    ) {
        return contextProvider.buildContext(incident);
    }
}