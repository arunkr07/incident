package com.incident.deployment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface DeploymentRepository
        extends JpaRepository<Deployment, Long> {

    @EntityGraph(attributePaths = "service")
    List<Deployment> findByServiceIdOrderByStartedAtDesc(
            Long serviceId
    );

    @EntityGraph(attributePaths = "service")
    List<Deployment> findAllByOrderByStartedAtDesc();
}