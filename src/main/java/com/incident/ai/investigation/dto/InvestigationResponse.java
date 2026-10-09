package com.incident.ai.investigation.dto;

import com.incident.ai.investigation.Investigation;
import com.incident.ai.investigation.InvestigationStatus;

import java.time.LocalDateTime;

public record InvestigationResponse(

        Long id,

        Long incidentId,

        InvestigationStatus status,

        String rootCause,

        Double confidence,

        String evidence,

        String recommendation,

        String followUpQuestions,

        String model,

        LocalDateTime startedAt,

        LocalDateTime completedAt,

        String errorMessage
) {

    public static InvestigationResponse from(
            Investigation investigation
    ) {

        return new InvestigationResponse(
                investigation.getId(),
                investigation.getIncident().getId(),
                investigation.getStatus(),
                investigation.getRootCause(),
                investigation.getConfidence(),
                investigation.getEvidence(),
                investigation.getRecommendation(),
                investigation.getFollowUpQuestions(),
                investigation.getModel(),
                investigation.getStartedAt(),
                investigation.getCompletedAt(),
                investigation.getErrorMessage()
        );
    }
}