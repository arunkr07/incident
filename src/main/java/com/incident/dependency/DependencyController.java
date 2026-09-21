package com.incident.dependency;

import com.incident.dependency.dto.*;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dependencies")
public class DependencyController {

    private final DependencyService service;

    public DependencyController(
            DependencyService service
    ) {
        this.service = service;
    }

    @GetMapping
    public List<DependencyResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/outgoing/{serviceId}")
    public List<DependencyResponse> getOutgoing(
            @PathVariable Long serviceId
    ) {
        return service.getOutgoing(serviceId);
    }

    @GetMapping("/incoming/{serviceId}")
    public List<DependencyResponse> getIncoming(
            @PathVariable Long serviceId
    ) {
        return service.getIncoming(serviceId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DependencyResponse create(
            @Valid @RequestBody DependencyRequest request
    ) {
        return service.create(request);
    }
}