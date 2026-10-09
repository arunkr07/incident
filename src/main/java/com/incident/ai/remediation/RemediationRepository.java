package com.incident.ai.remediation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RemediationRepository
        extends JpaRepository<Remediation, Long> {

    List<Remediation> findByIncidentIdOrderByCreatedAtDesc(
            Long incidentId
    );

    Optional<Remediation> findByIdAndStatus(
            Long id,
            RemediationStatus status
    );
}