package com.incident.incident;

import com.incident.common.exception.ApiException;
import com.incident.incident.cache.IncidentDeduplicationService;
import com.incident.incident.dto.IncidentRequest;
import com.incident.incident.dto.IncidentResponse;
import com.incident.incident.dto.IncidentTimelineResponse;
import com.incident.incident.event.EventType;
import com.incident.incident.event.IncidentEventFactory;
import com.incident.incident.event.KafkaEventPublisher;
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
    private final KafkaEventPublisher eventPublisher;
    private final IncidentEventFactory eventFactory;
    private final IncidentDeduplicationService deduplicationService;

    public IncidentService(
            IncidentRepository incidentRepository,
            IncidentTimelineRepository timelineRepository,
            ServiceService serviceService,
            KafkaEventPublisher eventPublisher,
            IncidentEventFactory eventFactory,
            IncidentDeduplicationService deduplicationService
    ) {
        this.incidentRepository = incidentRepository;
        this.timelineRepository = timelineRepository;
        this.serviceService = serviceService;
        this.eventPublisher = eventPublisher;
        this.eventFactory = eventFactory;
        this.deduplicationService = deduplicationService;
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

        Service service =
                serviceService.findEntity(request.serviceId());

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

        Incident saved =
                incidentRepository.save(incident);

        /*
         * Keep Redis synchronized for manually created
         * active incidents.
         */
        if (saved.getStatus() != IncidentStatus.RESOLVED) {

            deduplicationService.claim(
                    saved.getService().getId()
            );
        }

        addTimeline(
                saved,
                "INCIDENT_CREATED",
                "Incident created."
        );

        eventPublisher.publishIncidentCreated(
                eventFactory.create(
                        saved,
                        EventType.INCIDENT_CREATED
                )
        );

        return IncidentResponse.from(saved);
    }

    @Transactional
    public IncidentResponse update(
            Long id,
            IncidentRequest request
    ) {

        Incident incident = findEntity(id);

        IncidentStatus oldStatus = incident.getStatus();
        IncidentSeverity oldSeverity = incident.getSeverity();

        if (request.title() != null) {
            incident.setTitle(request.title());
        }

        if (request.description() != null) {
            incident.setDescription(request.description());
        }

        /*
         * Track severity changes in the incident timeline.
         */
        if (request.severity() != null
                && oldSeverity != request.severity()) {

            incident.setSeverity(request.severity());

            addTimeline(
                    incident,
                    "SEVERITY_CHANGED",
                    "Incident severity changed from "
                            + oldSeverity
                            + " to "
                            + request.severity()
            );
        }

        if (request.status() != null) {

            IncidentStatus newStatus = request.status();

            incident.setStatus(newStatus);

            /*
             * Only RESOLVED incidents have a resolved timestamp.
             */
            if (newStatus != IncidentStatus.RESOLVED) {
                incident.setResolvedAt(null);
            }

            /*
             * Set acknowledged timestamp the first time
             * the incident reaches ACKNOWLEDGED.
             */
            if (newStatus == IncidentStatus.ACKNOWLEDGED
                    && incident.getAcknowledgedAt() == null) {

                incident.setAcknowledgedAt(
                        LocalDateTime.now()
                );
            }

            /*
             * Set resolved timestamp when the incident
             * reaches RESOLVED.
             */
            if (newStatus == IncidentStatus.RESOLVED
                    && incident.getResolvedAt() == null) {

                incident.setResolvedAt(
                        LocalDateTime.now()
                );
            }

            if (oldStatus != newStatus) {

                addTimeline(
                        incident,
                        "STATUS_CHANGED",
                        "Incident status changed from "
                                + oldStatus
                                + " to "
                                + newStatus
                );
            }
        }

        Incident saved =
                incidentRepository.save(incident);

        /*
         * =========================================================
         * REDIS ACTIVE INCIDENT STATE
         * =========================================================
         *
         * Redis represents the CURRENT state of the incident.
         *
         * OPEN            -> active
         * ACKNOWLEDGED    -> active
         * INVESTIGATING   -> active
         * RESOLVED        -> inactive
         *
         * This must NOT depend on whether the status changed.
         */
        if (request.status() != null) {

            switch (request.status()) {

                case OPEN,
                     ACKNOWLEDGED,
                     INVESTIGATING -> {

                    deduplicationService.claim(
                            saved.getService().getId()
                    );
                }

                case RESOLVED -> {

                    deduplicationService.clear(
                            saved.getService().getId()
                    );
                }

                default -> {
                    // No Redis action.
                }
            }
        }

        /*
         * =========================================================
         * KAFKA INCIDENT LIFECYCLE EVENTS
         * =========================================================
         *
         * Kafka events are published ONLY when the status
         * actually changes.
         */
        if (request.status() != null
                && oldStatus != request.status()) {

            switch (request.status()) {

                case ACKNOWLEDGED -> {

                    eventPublisher.publishIncidentAcknowledged(
                            eventFactory.create(
                                    saved,
                                    EventType.INCIDENT_ACKNOWLEDGED
                            )
                    );
                }

                case INVESTIGATING -> {

                    eventPublisher.publishInvestigationStarted(
                            eventFactory.create(
                                    saved,
                                    EventType.INCIDENT_INVESTIGATION_STARTED
                            )
                    );
                }

                case RESOLVED -> {

                    eventPublisher.publishIncidentResolved(
                            eventFactory.create(
                                    saved,
                                    EventType.INCIDENT_RESOLVED
                            )
                    );
                }

                case OPEN -> {

                    /*
                     * OPEN after RESOLVED is a reopen event.
                     */
                    if (oldStatus == IncidentStatus.RESOLVED) {

                        eventPublisher.publishIncidentReopened(
                                eventFactory.create(
                                        saved,
                                        EventType.INCIDENT_REOPENED
                                )
                        );
                    }
                }

                default -> {
                    // No Kafka lifecycle event.
                }
            }
        }

        return IncidentResponse.from(saved);
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

        /*
         * MySQL remains the source of truth for active incidents.
         *
         * Redis provides fast deduplication in DetectionEngine,
         * while this database check prevents duplicate incidents
         * if Redis is unavailable or another execution reaches
         * this method concurrently.
         */
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

        Incident saved =
                incidentRepository.save(incident);

        /*
         * Redis active-incident state.
         *
         * DetectionEngine normally claims this before reaching
         * this method, but keeping the claim here makes the
         * detected incident state self-consistent.
         */
        deduplicationService.claim(
                saved.getService().getId()
        );

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

    @Transactional(readOnly = true)
    public List<IncidentTimelineResponse> getTimeline(
            Long incidentId
    ) {

        findEntity(incidentId);

        return timelineRepository
                .findByIncidentIdOrderByCreatedAtAsc(incidentId)
                .stream()
                .map(IncidentTimelineResponse::from)
                .toList();
    }

    private void addTimeline(
            Incident incident,
            String eventType,
            String message
    ) {

        IncidentTimeline timeline =
                new IncidentTimeline();

        timeline.setIncident(incident);
        timeline.setEventType(eventType);
        timeline.setMessage(message);

        timelineRepository.save(timeline);
    }
}