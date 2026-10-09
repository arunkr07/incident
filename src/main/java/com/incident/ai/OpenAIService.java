package com.incident.ai;

import com.incident.ai.investigation.InvestigationResult;
import com.openai.client.OpenAIClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.StructuredResponseCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OpenAIService {

    private final OpenAIClient client;
    private final String model;

    public OpenAIService(
            OpenAIClient client,
            @Value("${openai.model:gpt-5.6}")
            String model
    ) {
        this.client = client;
        this.model = model;
    }

    public InvestigationResult investigate(String prompt) {

        StructuredResponseCreateParams<InvestigationResult> params =
                ResponseCreateParams.builder()
                        .model(model)
                        .input(prompt)
                        .text(InvestigationResult.class)
                        .build();

        return client.responses()
                .create(params)
                .output()
                .stream()
                .flatMap(item -> item.message().stream())
                .flatMap(message -> message.content().stream())
                .flatMap(content -> content.outputText().stream())
                .findFirst()
                .orElseThrow(() ->
                        new AIException(
                                "AI returned no investigation result"
                        )
                );
    }
}