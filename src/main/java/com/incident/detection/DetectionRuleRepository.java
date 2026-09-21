package com.incident.detection;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetectionRuleRepository
        extends JpaRepository<DetectionRule, Long> {

    List<DetectionRule> findByEnabledTrue();

    List<DetectionRule> findByServiceId(
            Long serviceId
    );
}