package com.incident.metric;

import com.incident.metric.dto.MetricRequest;
import com.incident.metric.dto.MetricResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final MetricService service;

    public MetricController(MetricService service) {
        this.service = service;
    }

    @GetMapping
    public List<MetricResponse> getMetrics(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) String metricType,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to
    ) {

        return service.getMetrics(
                serviceId,
                metricType,
                from,
                to
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MetricResponse create(
            @Valid @RequestBody MetricRequest request
    ) {

        return service.create(request);
    }
}