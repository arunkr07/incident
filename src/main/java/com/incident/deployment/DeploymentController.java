package com.incident.deployment;

import com.incident.deployment.dto.*;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DeploymentService service;

    public DeploymentController(DeploymentService service) {
        this.service = service;
    }

    @GetMapping
    public List<DeploymentResponse> getAll(
            @RequestParam(required = false) Long serviceId
    ) {

        return service.getAll(serviceId);
    }

    @GetMapping("/{id}")
    public DeploymentResponse getById(
            @PathVariable Long id
    ) {

        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeploymentResponse create(
            @Valid @RequestBody DeploymentRequest request
    ) {

        return service.create(request);
    }

    @PatchMapping("/{id}")
    public DeploymentResponse update(
            @PathVariable Long id,
            @Valid @RequestBody DeploymentRequest request
    ) {

        return service.update(id, request);
    }
}