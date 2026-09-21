package com.incident.auth.dto;

import com.incident.auth.Manager;

public record UserResponse(
        Long id,
        String name,
        String email,
        String role
) {

    public static UserResponse from(
            Manager manager
    ) {

        return new UserResponse(
                manager.getId(),
                manager.getName(),
                manager.getEmail(),
                manager.getRole()
        );
    }
}