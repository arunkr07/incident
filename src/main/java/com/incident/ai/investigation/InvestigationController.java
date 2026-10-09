package com.incident.ai.investigation;

import com.incident.ai.investigation.dto.InvestigationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
public class InvestigationController {

    private final AIInvestigationService investigationService;

    public InvestigationController(
            AIInvestigationService investigationService
    ) {
        this.investigationService = investigationService;
    }

    @PostMapping("/{incidentId}/investigations")
    public ResponseEntity<InvestigationResponse> investigate(
            @PathVariable Long incidentId
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        investigationService.start(
                                incidentId
                        )
                );
    }

    @GetMapping("/{incidentId}/investigations/latest")
    public ResponseEntity<InvestigationResponse> latest(
            @PathVariable Long incidentId
    ) {

        InvestigationResponse response =
                investigationService.getLatest(
                        incidentId
                );

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }
}