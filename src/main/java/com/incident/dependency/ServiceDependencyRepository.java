package com.incident.dependency;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceDependencyRepository
        extends JpaRepository<ServiceDependency, Long> {

    List<ServiceDependency>
    findBySourceServiceId(Long serviceId);

    List<ServiceDependency>
    findByTargetServiceId(Long serviceId);
}