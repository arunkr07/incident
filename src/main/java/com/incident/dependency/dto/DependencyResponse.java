package com.incident.dependency.dto;

import com.incident.dependency.ServiceDependency;

public record DependencyResponse(

        Long id,

        Long sourceServiceId,
        String sourceServiceName,

        Long targetServiceId,
        String targetServiceName,

        String dependencyType

) {

    public static DependencyResponse from(
            ServiceDependency dependency
    ) {

        return new DependencyResponse(
                dependency.getId(),

                dependency.getSourceService().getId(),
                dependency.getSourceService().getName(),

                dependency.getTargetService().getId(),
                dependency.getTargetService().getName(),

                dependency.getDependencyType()
        );
    }
}