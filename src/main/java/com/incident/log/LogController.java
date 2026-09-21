package com.incident.log;

import com.incident.log.dto.LogRequest;
import com.incident.log.dto.LogResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final LogService service;

    public LogController(LogService service) {
        this.service = service;
    }

    @GetMapping
    public List<LogResponse> getLogs(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) LogLevel level,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to
    ) {

        return service.getLogs(
                serviceId,
                level,
                from,
                to
        );
    }

    @GetMapping("/{id}")
    public LogResponse getById(
            @PathVariable Long id
    ) {

        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LogResponse create(
            @Valid @RequestBody LogRequest request
    ) {

        return service.create(request);
    }
}