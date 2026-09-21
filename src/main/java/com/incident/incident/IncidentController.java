package com.incident.incident;

import com.incident.incident.dto.*;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public List<IncidentResponse> getAll(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) IncidentSeverity severity,
            @RequestParam(required = false) Long serviceId
    ) {

        return incidentService.getAll(
                status,
                severity,
                serviceId
        );
    }

    @GetMapping("/{id}")
    public IncidentResponse getById(
            @PathVariable Long id
    ) {

        return incidentService.getById(id);
    }

    @GetMapping("/{id}/timeline")
    public List<IncidentTimelineResponse> getTimeline(
            @PathVariable Long id
    ) {

        return incidentService.getTimeline(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidentResponse create(
            @Valid @RequestBody IncidentRequest request
    ) {

        return incidentService.create(request);
    }

    @PatchMapping("/{id}")
    public IncidentResponse update(
            @PathVariable Long id,
            @Valid @RequestBody IncidentRequest request
    ) {

        return incidentService.update(id, request);
    }
}