package com.incident.incident;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findAllByOrderByStartedAtDesc();

    List<Incident> findByStatusOrderByStartedAtDesc(
            IncidentStatus status
    );

    List<Incident> findBySeverityOrderByStartedAtDesc(
            IncidentSeverity severity
    );

    List<Incident> findByServiceIdOrderByStartedAtDesc(
            Long serviceId
    );

    boolean existsByServiceIdAndStatusIn(
            Long serviceId,
            List<IncidentStatus> statuses
    );
}