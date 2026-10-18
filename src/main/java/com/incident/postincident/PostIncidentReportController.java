package com.incident.postincident;
import com.incident.postincident.dto.PostIncidentReportResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/incidents/{incidentId}/post-incident-report")
public class PostIncidentReportController {
    private final PostIncidentReportService service;
    public PostIncidentReportController(PostIncidentReportService service) { this.service = service; }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostIncidentReportResponse generate(@PathVariable Long incidentId) {
        return service.generate(incidentId);
    }
    @GetMapping
    public PostIncidentReportResponse get(@PathVariable Long incidentId) {
        return service.get(incidentId);
    }
}
