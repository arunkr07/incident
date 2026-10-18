package com.incident.postincident.dto;
import com.incident.postincident.PostIncidentReport;
import java.time.LocalDateTime;
public record PostIncidentReportResponse(
        Long id, Long incidentId, String summary, String timeline,
        String probableRootCause, String evidence, String impact,
        String correctiveActions, String preventiveActions, String model,
        LocalDateTime generatedAt
) {
    public static PostIncidentReportResponse from(PostIncidentReport r) {
        return new PostIncidentReportResponse(
                r.getId(), r.getIncident().getId(), r.getSummary(),
                r.getTimelineJson(), r.getProbableRootCause(), r.getEvidenceJson(),
                r.getImpact(), r.getCorrectiveActionsJson(),
                r.getPreventiveActionsJson(), r.getModel(), r.getGeneratedAt());
    }
}
