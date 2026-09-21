package com.incident.incident;

import com.incident.common.exception.ApiException;
import com.incident.incident.dto.*;

import com.incident.service.Service;
import com.incident.service.ServiceService;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentTimelineRepository timelineRepository;
    private final ServiceService serviceService;

    public IncidentService(
            IncidentRepository incidentRepository,
            IncidentTimelineRepository timelineRepository,
            ServiceService serviceService
    ) {
        this.incidentRepository = incidentRepository;
        this.timelineRepository = timelineRepository;
        this.serviceService = serviceService;
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> getAll(
            IncidentStatus status,
            IncidentSeverity severity,
            Long serviceId
    ) {

        List<Incident> incidents;

        if (status != null) {
            incidents = incidentRepository
                    .findByStatusOrderByStartedAtDesc(status);

        } else if (severity != null) {
            incidents = incidentRepository
                    .findBySeverityOrderByStartedAtDesc(severity);

        } else if (serviceId != null) {
            incidents = incidentRepository
                    .findByServiceIdOrderByStartedAtDesc(serviceId);

        } else {
            incidents = incidentRepository
                    .findAllByOrderByStartedAtDesc();
        }

        return incidents.stream()
                .map(IncidentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public IncidentResponse getById(Long id) {

        return IncidentResponse.from(findEntity(id));
    }

    @Transactional
    public IncidentResponse create(IncidentRequest request) {

            Service service = serviceService.findEntity(request.serviceId());

            Incident incident = new Incident();

            incident.setTitle(request.title());
            incident.setDescription(request.description());
            incident.setSeverity(request.severity());

            incident.setStatus(
                    request.status() == null
                            ? IncidentStatus.OPEN
                            : request.status()
            );

            incident.setSource(
                    request.source() == null
                            ? IncidentSource.MANUAL
                            : request.source()
            );

            incident.setService(service);

            Incident saved = incidentRepository.save(incident);

            addTimeline(
                    saved,
                    "INCIDENT_CREATED",
                    "Incident created."
            );

            return IncidentResponse.from(saved);
    }

    @Transactional
    public IncidentResponse update(
            Long id,
            IncidentRequest request
    ) {

        Incident incident = findEntity(id);

        if (request.title() != null) {
            incident.setTitle(request.title());
        }

        if (request.description() != null) {
            incident.setDescription(request.description());
        }

        if (request.severity() != null) {
            incident.setSeverity(request.severity());
        }

        if (request.status() != null) {

            IncidentStatus oldStatus = incident.getStatus();

            incident.setStatus(request.status());

            if (request.status() == IncidentStatus.ACKNOWLEDGED
                    && incident.getAcknowledgedAt() == null) {

                incident.setAcknowledgedAt(LocalDateTime.now());
            }

            if (request.status() == IncidentStatus.RESOLVED
                    && incident.getResolvedAt() == null) {

                incident.setResolvedAt(LocalDateTime.now());
            }

            if (oldStatus != request.status()) {

                addTimeline(
                        incident,
                        "STATUS_CHANGED",
                        "Incident status changed from "
                                + oldStatus
                                + " to "
                                + request.status()
                );
            }
        }

        Incident saved = incidentRepository.save(incident);

        return IncidentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<IncidentTimelineResponse> getTimeline(Long incidentId) {

        findEntity(incidentId);

        return timelineRepository
                .findByIncidentIdOrderByCreatedAtAsc(incidentId)
                .stream()
                .map(IncidentTimelineResponse::from)
                .toList();
    }

    @Transactional
    public Incident createDetectedIncident(
            Service service,
            String title,
            String description,
            IncidentSeverity severity,
            IncidentSource source
    ) {

        List<IncidentStatus> activeStatuses = List.of(
                IncidentStatus.OPEN,
                IncidentStatus.ACKNOWLEDGED,
                IncidentStatus.INVESTIGATING
        );

        boolean alreadyActive =
                incidentRepository.existsByServiceIdAndStatusIn(
                        service.getId(),
                        activeStatuses
                );

        if (alreadyActive) {
            return null;
        }

        Incident incident = new Incident();

        incident.setTitle(title);
        incident.setDescription(description);
        incident.setSeverity(severity);
        incident.setStatus(IncidentStatus.OPEN);
        incident.setSource(source);
        incident.setService(service);

        Incident saved = incidentRepository.save(incident);

        addTimeline(
                saved,
                "INCIDENT_DETECTED",
                "Incident automatically detected by "
                        + source
                        + "."
        );

        return saved;
    }

    public Incident findEntity(Long id) {

        return incidentRepository.findById(id)
                .orElseThrow(() ->
                        new ApiException(
                                HttpStatus.NOT_FOUND,
                                "Incident not found"
                        )
                );
    }

    private void addTimeline(
            Incident incident,
            String eventType,
            String message
    ) {

        IncidentTimeline timeline = new IncidentTimeline();

        timeline.setIncident(incident);
        timeline.setEventType(eventType);
        timeline.setMessage(message);

        timelineRepository.save(timeline);
    }
}