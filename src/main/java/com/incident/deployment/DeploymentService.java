package com.incident.deployment;

import com.incident.common.exception.ApiException;
import com.incident.deployment.dto.*;

import com.incident.service.Service;
import com.incident.service.ServiceService;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class DeploymentService {

    private final DeploymentRepository repository;
    private final ServiceService serviceService;

    public DeploymentService(
            DeploymentRepository repository,
            ServiceService serviceService
    ) {
        this.repository = repository;
        this.serviceService = serviceService;
    }

    @Transactional
    public List<DeploymentResponse> getAll(Long serviceId) {

        List<Deployment> deployments;

        if (serviceId != null) {

            deployments =
                    repository.findByServiceIdOrderByStartedAtDesc(
                            serviceId
                    );

        } else {

            deployments =
                    repository.findAllByOrderByStartedAtDesc();
        }

        return deployments.stream()
                .map(DeploymentResponse::from)
                .toList();
    }

    @Transactional
    public DeploymentResponse getById(Long id) {

        return DeploymentResponse.from(findEntity(id));
    }

    @Transactional
    public DeploymentResponse create(
            DeploymentRequest request
    ) {

        Service service =
                serviceService.findEntity(request.serviceId());

        Deployment deployment = new Deployment();

        deployment.setService(service);
        deployment.setVersion(request.version());
        deployment.setDescription(request.description());

        DeploymentStatus status =
                request.status() == null
                        ? DeploymentStatus.IN_PROGRESS
                        : request.status();

        deployment.setStatus(status);

        if (status != DeploymentStatus.IN_PROGRESS) {
            deployment.setCompletedAt(LocalDateTime.now());
        }

        return DeploymentResponse.from(
                repository.save(deployment)
        );
    }

    @Transactional
    public DeploymentResponse update(
            Long id,
            DeploymentRequest request
    ) {

        Deployment deployment = findEntity(id);

        if (request.version() != null) {
            deployment.setVersion(request.version());
        }

        if (request.description() != null) {
            deployment.setDescription(request.description());
        }

        if (request.status() != null) {

            deployment.setStatus(request.status());

            if (request.status() != DeploymentStatus.IN_PROGRESS) {
                deployment.setCompletedAt(LocalDateTime.now());
            }
        }

        return DeploymentResponse.from(
                repository.save(deployment)
        );
    }

    private Deployment findEntity(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                HttpStatus.NOT_FOUND,
                                "Deployment not found"
                        )
                );
    }
}