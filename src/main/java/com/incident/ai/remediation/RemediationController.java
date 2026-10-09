package com.incident.ai.remediation;

import com.incident.ai.remediation.dto.RemediationRequest;
import com.incident.ai.remediation.dto.RemediationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class RemediationController {

    private final RemediationService remediationService;

    public RemediationController(
            RemediationService remediationService
    ) {
        this.remediationService =
                remediationService;
    }

    @PostMapping("/{incidentId}/remediations")
    public ResponseEntity<RemediationResponse> create(
            @PathVariable Long incidentId,
            @RequestBody RemediationRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        remediationService.create(
                                incidentId,
                                request
                        )
                );
    }

    @GetMapping("/{incidentId}/remediations")
    public ResponseEntity<List<RemediationResponse>> getForIncident(
            @PathVariable Long incidentId
    ) {

        return ResponseEntity.ok(
                remediationService.getForIncident(
                        incidentId
                )
        );
    }

    @PostMapping("/remediations/{id}/approve")
    public ResponseEntity<RemediationResponse> approve(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                remediationService.approve(id)
        );
    }

    @PostMapping("/remediations/{id}/reject")
    public ResponseEntity<RemediationResponse> reject(
            @PathVariable Long id,
            @RequestParam String reason
    ) {

        return ResponseEntity.ok(
                remediationService.reject(
                        id,
                        reason
                )
        );
    }

    @PostMapping("/remediations/{id}/execute")
    public ResponseEntity<RemediationResponse> execute(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                remediationService.execute(id)
        );
    }
}