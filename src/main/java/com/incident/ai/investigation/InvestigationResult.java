package com.incident.ai.investigation;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

public class InvestigationResult {

    @JsonPropertyDescription(
            "Most likely root cause. Do not invent evidence."
    )
    public String rootCause;

    @JsonPropertyDescription(
            "Confidence from 0.0 to 1.0 based only on supplied evidence."
    )
    public double confidence;

    @JsonPropertyDescription(
            "Concrete pieces of evidence supporting the root cause."
    )
    public List<String> evidence;

    @JsonPropertyDescription(
            "Recommended next action for the production manager."
    )
    public String recommendation;

    @JsonPropertyDescription(
            "Questions that should be answered if evidence is insufficient."
    )
    public List<String> followUpQuestions;
}