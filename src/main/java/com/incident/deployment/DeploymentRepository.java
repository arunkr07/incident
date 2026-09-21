package com.incident.deployment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeploymentRepository
        extends JpaRepository<Deployment, Long> {

    List<Deployment> findByServiceIdOrderByStartedAtDesc(
            Long serviceId
    );

    List<Deployment> findAllByOrderByStartedAtDesc();
}