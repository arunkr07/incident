package com.incident.assistant;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.incident.ai.OpenAIService;
import com.incident.ai.investigation.InvestigationContextService;
import com.incident.ai.investigation.dto.InvestigationContext;
import com.incident.assistant.dto.AssistantAnswerResponse;
import com.incident.common.exception.ApiException;
import com.incident.incident.Incident;
import com.incident.incident.IncidentService;
import com.incident.settings.ManagerSettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class IncidentAssistantService {
    private final IncidentService incidentService;
    private final InvestigationContextService contextService;
    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper;
    private final ManagerSettingsService managerSettingsService;

    public IncidentAssistantService(IncidentService incidentService,
                                    InvestigationContextService contextService, OpenAIService openAIService,
                                    ObjectMapper objectMapper, ManagerSettingsService managerSettingsService) {
        this.incidentService = incidentService;
        this.contextService = contextService;
        this.openAIService = openAIService;
        this.objectMapper = objectMapper;
        this.managerSettingsService = managerSettingsService;
    }

    @Transactional(readOnly = true)
    public AssistantAnswerResponse ask(Long incidentId, String question) {
        return ask(incidentId, question, null);
    }

    @Transactional(readOnly = true)
    public AssistantAnswerResponse ask(Long incidentId, String question, String managerEmail) {
        Incident incident = incidentService.findEntity(incidentId);
        Map<String, Object> aiPreferences = null;
        if (managerEmail != null) {
            Map<String, Object> settings = managerSettingsService.getForEmail(managerEmail);
            Object configured = settings.get("ai");
            if (configured instanceof Map<?, ?> rawPreferences) {
                aiPreferences = new java.util.LinkedHashMap<>();
                for (Map.Entry<?, ?> entry : rawPreferences.entrySet()) {
                    if (entry.getKey() instanceof String key) aiPreferences.put(key, entry.getValue());
                }
            }
            if (aiPreferences != null && Boolean.FALSE.equals(aiPreferences.get("enabled"))) {
                throw new ApiException(HttpStatus.FORBIDDEN, "AI assistant is disabled in manager settings.");
            }
        }
        InvestigationContext context = managerEmail == null
                ? contextService.collect(incident)
                : contextService.collect(incident, aiPreferences);
        String prompt = """
                You are the incident response assistant for a production manager.
                Answer using only the supplied incident context. Never invent telemetry,
                deployment facts, customer impact, or actions. Explicitly separate confirmed
                evidence from hypotheses. If context is insufficient, say what is missing and
                suggest specific checks. Do not claim to execute production changes.
                Keep the answer concise and operationally useful.

                CONTEXT JSON:
                %s

                MANAGER QUESTION:
                %s
                """.formatted(toJson(context), question);
        String answer;
        try { answer = openAIService.answer(prompt); }
        catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "AI assistant request failed. Check backend logs and AI configuration.");
        }

        List<String> sources = new ArrayList<>();
        if (context.timeline() != null && !context.timeline().isEmpty()) sources.add("incident timeline");
        if (context.logs() != null && !context.logs().isEmpty()) sources.add("service logs");
        if (context.metrics() != null && !context.metrics().isEmpty()) sources.add("service metrics");
        if (context.deployments() != null && !context.deployments().isEmpty()) sources.add("deployment history");
        if (context.dependencies() != null && !context.dependencies().isEmpty()) sources.add("service dependencies");
        if (context.previousIncidents() != null && !context.previousIncidents().isEmpty()) sources.add("previous incidents");
        if (sources.isEmpty()) sources.add("incident metadata only");
        return new AssistantAnswerResponse(incidentId, question, answer,
                openAIService.getModel(), List.copyOf(sources), LocalDateTime.now());
    }

    private String toJson(Object value) {
        try { return objectMapper.writeValueAsString(value); }
        catch (JsonProcessingException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not serialize incident context.");
        }
    }
}
