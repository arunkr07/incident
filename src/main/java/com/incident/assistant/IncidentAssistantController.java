package com.incident.assistant;
import com.incident.assistant.dto.AssistantAnswerResponse;
import com.incident.assistant.dto.AssistantQuestionRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/incidents/{incidentId}/assistant")
public class IncidentAssistantController {
    private final IncidentAssistantService service;
    public IncidentAssistantController(IncidentAssistantService service) { this.service = service; }
    @PostMapping("/questions")
    public AssistantAnswerResponse ask(@PathVariable Long incidentId,
            @Valid @RequestBody AssistantQuestionRequest request) {
        return service.ask(incidentId, request.question());
    }
}
