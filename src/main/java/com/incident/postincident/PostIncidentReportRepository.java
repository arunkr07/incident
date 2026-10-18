package com.incident.postincident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface PostIncidentReportRepository extends JpaRepository<PostIncidentReport, Long> {
    Optional<PostIncidentReport> findByIncidentId(Long incidentId);
}
