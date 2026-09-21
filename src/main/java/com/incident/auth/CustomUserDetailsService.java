package com.incident.auth;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final ManagerRepository managerRepository;

    public CustomUserDetailsService(
            ManagerRepository managerRepository
    ) {
        this.managerRepository = managerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String email
    ) throws UsernameNotFoundException {

        Manager manager =
                managerRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Manager not found."
                                )
                        );

        return User
                .withUsername(manager.getEmail())
                .password(manager.getPassword())
                .roles(manager.getRole())
                .build();
    }
}