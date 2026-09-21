package com.incident.service;

import com.incident.service.dto.ServiceRequest;
import com.incident.service.dto.ServiceResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService service;

    public ServiceController(ServiceService service) {
        this.service = service;
    }

    @GetMapping
    public List<ServiceResponse> getAll(
            @RequestParam(required = false) String environment
    ) {
        return service.getAll(environment);
    }

    @GetMapping("/{id}")
    public ServiceResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceResponse create(
            @Valid @RequestBody ServiceRequest request
    ) {
        return service.create(request);
    }

    @PatchMapping("/{id}")
    public ServiceResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request
    ) {
        return service.update(id, request);
    }
}