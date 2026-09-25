package com.incident.deployment;

import com.incident.common.exception.ApiException;
import com.incident.deployment.dto.DeploymentRequest;
import com.incident.deployment.dto.DeploymentResponse;
import com.incident.incident.event.DeploymentEvent;
import com.incident.incident.event.EventType;
import com.incident.incident.event.KafkaEventPublisher;
import com.incident.service.Service;
import com.incident.service.ServiceService;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Service
public class DeploymentService {

    private final DeploymentRepository repository;
    private final ServiceService serviceService;
    private final KafkaEventPublisher eventPublisher;

    public DeploymentService(
            DeploymentRepository repository,
            ServiceService serviceService,
            KafkaEventPublisher eventPublisher
    ) {
        this.repository = repository;
        this.serviceService = serviceService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<DeploymentResponse> getAll(Long serviceId) {

        List<Deployment> deployments;

        if (serviceId != null) {
            deployments =
                    repository.findByServiceIdOrderByStartedAtDesc(serviceId);
        } else {
            deployments =
                    repository.findAllByOrderByStartedAtDesc();
        }

        return deployments.stream()
                .map(DeploymentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DeploymentResponse getById(Long id) {
        return DeploymentResponse.from(findEntity(id));
    }

    @Transactional
    public DeploymentResponse create(DeploymentRequest request) {

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

        Deployment saved = repository.save(deployment);

        // deployment.created
        eventPublisher.publishDeploymentCreated(
                new DeploymentEvent(
                        UUID.randomUUID(),
                        EventType.DEPLOYMENT_CREATED,
                        saved.getId(),
                        saved.getService().getId(),
                        saved.getService().getName(),
                        saved.getVersion(),
                        saved.getStatus().name(),
                        LocalDateTime.now()
                )
        );

        // deployment.completed
        // Only publish when the resulting deployment status is COMPLETED.
        if (saved.getStatus() == DeploymentStatus.COMPLETED) {

            eventPublisher.publishDeploymentCompleted(
                    new DeploymentEvent(
                            UUID.randomUUID(),
                            EventType.DEPLOYMENT_COMPLETED,
                            saved.getId(),
                            saved.getService().getId(),
                            saved.getService().getName(),
                            saved.getVersion(),
                            saved.getStatus().name(),
                            LocalDateTime.now()
                    )
            );
        }

        return DeploymentResponse.from(saved);
    }

    @Transactional
    public DeploymentResponse update(
            Long id,
            DeploymentRequest request
    ) {

        Deployment deployment = findEntity(id);

        DeploymentStatus oldStatus =
                deployment.getStatus();

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

        Deployment saved = repository.save(deployment);

        // Publish completed event only when the deployment
        // actually transitions into COMPLETED.
        if (oldStatus != DeploymentStatus.COMPLETED
                && saved.getStatus() == DeploymentStatus.COMPLETED) {

            eventPublisher.publishDeploymentCompleted(
                    new DeploymentEvent(
                            UUID.randomUUID(),
                            EventType.DEPLOYMENT_COMPLETED,
                            saved.getId(),
                            saved.getService().getId(),
                            saved.getService().getName(),
                            saved.getVersion(),
                            saved.getStatus().name(),
                            LocalDateTime.now()
                    )
            );
        }

        return DeploymentResponse.from(saved);
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