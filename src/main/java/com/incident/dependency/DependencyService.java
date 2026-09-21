package com.incident.dependency;

import com.incident.common.exception.ApiException;
import com.incident.dependency.dto.*;

import com.incident.service.Service;
import com.incident.service.ServiceService;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;

import java.util.List;

@org.springframework.stereotype.Service
public class DependencyService {

    private final ServiceDependencyRepository repository;
    private final ServiceService serviceService;

    public DependencyService(
            ServiceDependencyRepository repository,
            ServiceService serviceService
    ) {
        this.repository = repository;
        this.serviceService = serviceService;
    }

    @Transactional
    public List<DependencyResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(DependencyResponse::from)
                .toList();
    }

    @Transactional
    public List<DependencyResponse> getOutgoing(
            Long serviceId
    ) {

        serviceService.findEntity(serviceId);

        return repository
                .findBySourceServiceId(serviceId)
                .stream()
                .map(DependencyResponse::from)
                .toList();
    }

    @Transactional
    public List<DependencyResponse> getIncoming(
            Long serviceId
    ) {

        serviceService.findEntity(serviceId);

        return repository
                .findByTargetServiceId(serviceId)
                .stream()
                .map(DependencyResponse::from)
                .toList();
    }

    @Transactional
    public DependencyResponse create(
            DependencyRequest request
    ) {

        if (request.sourceServiceId()
                .equals(request.targetServiceId())) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "A service cannot depend on itself"
            );
        }

        Service source =
                serviceService.findEntity(
                        request.sourceServiceId()
                );

        Service target =
                serviceService.findEntity(
                        request.targetServiceId()
                );

        ServiceDependency dependency =
                new ServiceDependency();

        dependency.setSourceService(source);
        dependency.setTargetService(target);

        dependency.setDependencyType(
                request.dependencyType() == null
                        ? "SYNCHRONOUS"
                        : request.dependencyType()
        );

        return DependencyResponse.from(
                repository.save(dependency)
        );
    }
}