package com.incident.service;

import com.incident.common.exception.ApiException;
import com.incident.service.dto.ServiceRequest;
import com.incident.service.dto.ServiceResponse;
import org.springframework.http.HttpStatus;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository repository;

    public ServiceService(ServiceRepository repository) {
        this.repository = repository;
    }

    public List<ServiceResponse> getAll(String environment) {

        if (environment == null || environment.isBlank()) {
            return repository.findAll()
                    .stream()
                    .map(ServiceResponse::from)
                    .toList();
        }

        return repository.findByEnvironment(environment)
                .stream()
                .map(ServiceResponse::from)
                .toList();
    }

    public ServiceResponse getById(Long id) {

        return ServiceResponse.from(findEntity(id));
    }

    public ServiceResponse create(ServiceRequest request) {

        Service service = new Service();

        service.setName(request.name());
        service.setDescription(request.description());
        service.setStatus(
                request.status() == null
                        ? ServiceStatus.HEALTHY
                        : request.status()
        );
        service.setEnvironment(
                request.environment() == null || request.environment().isBlank()
                        ? "PRODUCTION"
                        : request.environment()
        );
        service.setEndpoint(request.endpoint());

        return ServiceResponse.from(repository.save(service));
    }

    public ServiceResponse update(Long id, ServiceRequest request) {

        Service service = findEntity(id);

        if (request.name() != null && !request.name().isBlank()) {
            service.setName(request.name());
        }

        if (request.description() != null) {
            service.setDescription(request.description());
        }

        if (request.status() != null) {
            service.setStatus(request.status());
        }

        if (request.environment() != null && !request.environment().isBlank()) {
            service.setEnvironment(request.environment());
        }

        if (request.endpoint() != null) {
            service.setEndpoint(request.endpoint());
        }

        return ServiceResponse.from(repository.save(service));
    }

    public Service findEntity(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                HttpStatus.NOT_FOUND,
                                "Service not found"
                        )
                );
    }
}