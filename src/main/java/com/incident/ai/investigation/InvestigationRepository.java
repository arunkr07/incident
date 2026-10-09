package com.incident.ai.investigation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvestigationRepository
        extends JpaRepository<Investigation, Long> {

    List<Investigation> findByIncidentIdOrderByStartedAtDesc(
            Long incidentId
    );

    Optional<Investigation> findFirstByIncidentIdOrderByStartedAtDesc(
            Long incidentId
    );

    boolean existsByIncidentIdAndStatus(
            Long incidentId,
            InvestigationStatus status
    );
}