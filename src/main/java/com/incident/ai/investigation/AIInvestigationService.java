package com.incident.ai.investigation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incident.ai.OpenAIService;
import com.incident.ai.investigation.dto.InvestigationContext;
import com.incident.ai.investigation.dto.InvestigationResponse;
import com.incident.incident.Incident;
import com.incident.incident.IncidentService;
import com.incident.settings.ManagerSettingsService;
import com.incident.common.exception.ApiException;
import org.springframework.http.HttpStatus;

import java.util.Map;
import com.incident.incident.event.EventType;
import com.incident.incident.event.IncidentEventFactory;
import com.incident.incident.event.KafkaEventPublisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AIInvestigationService {

    private final IncidentService incidentService;
    private final InvestigationRepository investigationRepository;
    private final InvestigationContextService contextService;
    private final InvestigationPromptBuilder promptBuilder;
    private final OpenAIService openAIService;
    private final KafkaEventPublisher eventPublisher;
    private final IncidentEventFactory eventFactory;
    private final ObjectMapper objectMapper;
    private final ManagerSettingsService managerSettingsService;

    @Value("${openai.model:gpt-5.6}")
    private String model;

    public AIInvestigationService(
            IncidentService incidentService,
            InvestigationRepository investigationRepository,
            InvestigationContextService contextService,
            InvestigationPromptBuilder promptBuilder,
            OpenAIService openAIService,
            KafkaEventPublisher eventPublisher,
            IncidentEventFactory eventFactory,
            ObjectMapper objectMapper,
            ManagerSettingsService managerSettingsService
    ) {
        this.incidentService = incidentService;
        this.investigationRepository = investigationRepository;
        this.contextService = contextService;
        this.promptBuilder = promptBuilder;
        this.openAIService = openAIService;
        this.eventPublisher = eventPublisher;
        this.eventFactory = eventFactory;
        this.objectMapper = objectMapper;
        this.managerSettingsService = managerSettingsService;
    }

    @Transactional
    public InvestigationResponse start(Long incidentId) {
        return start(incidentId, null);
    }

    @Transactional
    public InvestigationResponse start(Long incidentId, String managerEmail) {
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
                throw new ApiException(HttpStatus.FORBIDDEN, "AI investigation is disabled in manager settings.");
            }
        }

        Incident incident =
                incidentService.findEntity(incidentId);

        Investigation investigation =
                new Investigation();

        investigation.setIncident(incident);
        investigation.setStatus(
                InvestigationStatus.RUNNING
        );
        investigation.setStartedAt(
                LocalDateTime.now()
        );
        investigation.setModel(model);

        Investigation saved =
                investigationRepository.save(
                        investigation
                );

        try {

            InvestigationContext context =
                    managerEmail == null
                            ? contextService.collect(incident)
                            : contextService.collect(incident, aiPreferences);

            String prompt =
                    promptBuilder.build(context);

            InvestigationResult result =
                    openAIService.investigate(prompt);

            saved.setRootCause(
                    result.rootCause
            );

            saved.setConfidence(
                    result.confidence
            );

            saved.setEvidence(
                    objectMapper.writeValueAsString(
                            result.evidence
                    )
            );

            saved.setRecommendation(
                    result.recommendation
            );

            saved.setFollowUpQuestions(
                    objectMapper.writeValueAsString(
                            result.followUpQuestions
                    )
            );

            saved.setStatus(
                    InvestigationStatus.COMPLETED
            );

            saved.setCompletedAt(
                    LocalDateTime.now()
            );

            Investigation completed =
                    investigationRepository.save(saved);

            publishCompletedEvent(
                    completed
            );

            return InvestigationResponse.from(
                    completed
            );

        } catch (Exception exception) {

            saved.setStatus(
                    InvestigationStatus.FAILED
            );

            saved.setErrorMessage(
                    exception.getMessage()
            );

            saved.setCompletedAt(
                    LocalDateTime.now()
            );

            Investigation failed =
                    investigationRepository.save(saved);

            return InvestigationResponse.from(
                    failed
            );
        }
    }

    @Transactional(readOnly = true)
    public InvestigationResponse getLatest(
            Long incidentId
    ) {

        return investigationRepository
                .findFirstByIncidentIdOrderByStartedAtDesc(
                        incidentId
                )
                .map(InvestigationResponse::from)
                .orElse(null);
    }

    private void publishCompletedEvent(
            Investigation investigation
    ) {

        eventPublisher.publishAIInvestigationCompleted(
                eventFactory.create(
                        investigation.getIncident(),
                        EventType.AI_INVESTIGATION_COMPLETED
                )
        );
    }
}