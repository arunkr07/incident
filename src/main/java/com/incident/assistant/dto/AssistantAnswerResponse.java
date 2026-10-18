package com.incident.assistant.dto;
import java.time.LocalDateTime;
import java.util.List;
public record AssistantAnswerResponse(Long incidentId, String question, String answer,
        String model, List<String> evidenceSources, LocalDateTime answeredAt) {}
