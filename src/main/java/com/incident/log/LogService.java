package com.incident.log;

import com.incident.common.exception.ApiException;
import com.incident.log.dto.LogRequest;
import com.incident.log.dto.LogResponse;
import com.incident.service.Service;
import com.incident.service.ServiceService;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class LogService {

    private final LogRepository repository;
    private final ServiceService serviceService;

    public LogService(
            LogRepository repository,
            ServiceService serviceService
    ) {
        this.repository = repository;
        this.serviceService = serviceService;
    }

    @Transactional
    public List<LogResponse> getLogs(
            Long serviceId,
            LogLevel level,
            LocalDateTime from,
            LocalDateTime to
    ) {

        List<Log> logs;

        if (serviceId != null) {

            logs = repository
                    .findByServiceIdOrderByTimestampDesc(serviceId);

        } else if (level != null) {

            logs = repository
                    .findByLevelOrderByTimestampDesc(level);

        } else if (from != null && to != null) {

            logs = repository
                    .findByTimestampBetweenOrderByTimestampDesc(
                            from,
                            to
                    );

        } else {

            logs = repository.findAll();
        }

        return logs.stream()
                .map(LogResponse::from)
                .toList();
    }

    @Transactional
    public LogResponse getById(Long id) {

        Log log = repository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                HttpStatus.NOT_FOUND,
                                "Log not found"
                        )
                );

        return LogResponse.from(log);
    }

    @Transactional
    public LogResponse create(LogRequest request) {

        Service service =
                serviceService.findEntity(request.serviceId());

        Log log = new Log();

        log.setService(service);
        log.setLevel(request.level());
        log.setMessage(request.message());
        log.setTimestamp(
                request.timestamp() == null
                        ? LocalDateTime.now()
                        : request.timestamp()
        );
        log.setTraceId(request.traceId());
        log.setRequestId(request.requestId());

        return LogResponse.from(repository.save(log));
    }
}