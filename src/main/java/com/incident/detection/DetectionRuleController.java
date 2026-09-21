package com.incident.detection;

import com.incident.detection.dto.*;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detection/rules")
public class DetectionRuleController {

    private final DetectionRuleService service;

    public DetectionRuleController(
            DetectionRuleService service
    ) {
        this.service = service;
    }

    @GetMapping
    public List<DetectionRuleResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/service/{serviceId}")
    public List<DetectionRuleResponse> getByService(
            @PathVariable Long serviceId
    ) {
        return service.getByService(serviceId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DetectionRuleResponse create(
            @Valid @RequestBody DetectionRuleRequest request
    ) {
        DetectionRuleResponse response = service.create(request);
        return response;
    }

    @PatchMapping("/{id}")
    public DetectionRuleResponse update(
            @PathVariable Long id,
            @Valid @RequestBody DetectionRuleUpdateRequest request
    ) {

        return service.update(id, request);
    }
}