package com.incident.postincident;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.incident.ai.OpenAIService;
import com.incident.ai.investigation.InvestigationContextService;
import com.incident.ai.investigation.dto.InvestigationContext;
import com.incident.common.exception.ApiException;
import com.incident.incident.Incident;
import com.incident.incident.IncidentService;
import com.incident.incident.IncidentTimelineRepository;
import com.incident.postincident.dto.PostIncidentReportResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostIncidentReportService {
    private final IncidentService incidentService;
    private final IncidentTimelineRepository timelineRepository;
    private final InvestigationContextService contextService;
    private final OpenAIService openAIService;
    private final PostIncidentReportRepository repository;
    private final ObjectMapper objectMapper;

    public PostIncidentReportService(IncidentService incidentService,
            IncidentTimelineRepository timelineRepository,
            InvestigationContextService contextService, OpenAIService openAIService,
            PostIncidentReportRepository repository, ObjectMapper objectMapper) {
        this.incidentService = incidentService;
        this.timelineRepository = timelineRepository;
        this.contextService = contextService;
        this.openAIService = openAIService;
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public PostIncidentReportResponse generate(Long incidentId) {
        Incident incident = incidentService.findEntity(incidentId);
        InvestigationContext context = contextService.collect(incident);
        List<String> timeline = timelineRepository
                .findByIncidentIdOrderByCreatedAtAsc(incidentId).stream()
                .map(t -> t.getCreatedAt() + " | " + t.getEventType() + " | " + t.getMessage())
                .toList();

        String prompt = """
                You are preparing a production post-incident report.
                Use only the supplied JSON context. Never invent metrics, user counts, durations,
                actions, timestamps, or evidence. Separate recorded facts from recommendations.
                If a fact is unavailable, explicitly state that it is unavailable.
                Return summary, probableRootCause, evidence, impact, correctiveActions,
                and preventiveActions. Be concise, operationally useful, and evidence-grounded.

                INCIDENT CONTEXT:
                %s

                RECORDED TIMELINE:
                %s
                """.formatted(toJson(context), toJson(timeline));

        PostIncidentReportResult result;
        try {
            result = openAIService.generateStructured(prompt, PostIncidentReportResult.class);
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "AI report generation failed. Check backend logs and AI configuration.");
        }

        PostIncidentReport report = repository.findByIncidentId(incidentId)
                .orElseGet(PostIncidentReport::new);
        report.setIncident(incident);
        report.setSummary(nonBlank(result.summary, "Summary unavailable from AI response."));
        report.setTimelineJson(toJson(timeline));
        report.setProbableRootCause(nonBlank(result.probableRootCause,
                "Probable root cause could not be determined from available evidence."));
        report.setEvidenceJson(toJson(result.evidence == null ? List.of() : result.evidence));
        report.setImpact(nonBlank(result.impact, "Impact data unavailable."));
        report.setCorrectiveActionsJson(toJson(result.correctiveActions == null ? List.of() : result.correctiveActions));
        report.setPreventiveActionsJson(toJson(result.preventiveActions == null ? List.of() : result.preventiveActions));
        report.setModel(openAIService.getModel());
        report.setGeneratedAt(LocalDateTime.now());
        return PostIncidentReportResponse.from(repository.save(report));
    }

    @Transactional(readOnly = true)
    public PostIncidentReportResponse get(Long incidentId) {
        incidentService.findEntity(incidentId);
        return repository.findByIncidentId(incidentId)
                .map(PostIncidentReportResponse::from)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Post-incident report not found"));
    }

    private String toJson(Object value) {
        try { return objectMapper.writeValueAsString(value); }
        catch (JsonProcessingException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not serialize report context.");
        }
    }
    private String nonBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
