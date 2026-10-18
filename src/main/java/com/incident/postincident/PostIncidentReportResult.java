package com.incident.postincident;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import java.util.List;
public class PostIncidentReportResult {
    @JsonPropertyDescription("Concise factual summary of the incident and recovery.")
    public String summary;
    @JsonPropertyDescription("Most likely root cause. Explicitly say unknown if evidence is insufficient.")
    public String probableRootCause;
    @JsonPropertyDescription("Evidence statements grounded only in supplied incident context.")
    public List<String> evidence;
    @JsonPropertyDescription("Impact described only where supported; otherwise say impact data is unavailable.")
    public String impact;
    @JsonPropertyDescription("Corrective actions taken or recommended; distinguish recorded actions from recommendations.")
    public List<String> correctiveActions;
    @JsonPropertyDescription("Preventive actions recommended to reduce recurrence risk.")
    public List<String> preventiveActions;
}
