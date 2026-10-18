package com.incident.assistant.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record AssistantQuestionRequest(@NotBlank @Size(max = 4000) String question) {}
