package com.incident.ai.investigation;

import com.incident.ai.investigation.dto.InvestigationContext;
import com.incident.incident.Incident;

public interface InvestigationContextProvider {

    InvestigationContext buildContext(
            Incident incident
    );
}