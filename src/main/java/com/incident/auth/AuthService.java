package com.incident.auth;

import com.incident.auth.dto.AuthResponse;
import com.incident.auth.dto.ChangePasswordRequest;
import com.incident.auth.dto.LoginRequest;
import com.incident.auth.dto.RegisterRequest;
import com.incident.auth.dto.UserResponse;
import com.incident.common.exception.ApiException;
import com.incident.security.JwtService;

import org.springframework.http.HttpStatus;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final ManagerRepository managerRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(
            ManagerRepository managerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.managerRepository = managerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(
            RegisterRequest request
    ) {

        String email =
                normalizeEmail(request.email());

        if (
                managerRepository
                        .existsByEmail(email)
        ) {

            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists."
            );
        }

        Manager manager = new Manager();

        manager.setName(
                request.name().trim()
        );

        manager.setEmail(email);

        manager.setPassword(
                passwordEncoder.encode(
                        request.password()
                )
        );

        manager.setRole("MANAGER");

        Manager savedManager =
                managerRepository.save(manager);

        String token =
                jwtService.generateToken(
                        savedManager
                );

        return new AuthResponse(
                token,
                UserResponse.from(savedManager)
        );
    }


    @Transactional(readOnly = true)
    public AuthResponse login(
            LoginRequest request
    ) {

        String email =
                normalizeEmail(request.email());

        Manager manager =
                managerRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ApiException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid email or password."
                                )
                        );

        if (
                !passwordEncoder.matches(
                        request.password(),
                        manager.getPassword()
                )
        ) {

            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password."
            );
        }

        String token =
                jwtService.generateToken(manager);

        return new AuthResponse(
                token,
                UserResponse.from(manager)
        );
    }


    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(
            String email
    ) {

        Manager manager =
                managerRepository
                        .findByEmail(
                                normalizeEmail(email)
                        )
                        .orElseThrow(() ->
                                new ApiException(
                                        HttpStatus.NOT_FOUND,
                                        "Manager account not found."
                                )
                        );

        return UserResponse.from(manager);
    }


    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        Manager manager =
                managerRepository
                        .findByEmail(
                                normalizeEmail(email)
                        )
                        .orElseThrow(() ->
                                new ApiException(
                                        HttpStatus.NOT_FOUND,
                                        "Manager account not found."
                                )
                        );

        if (
                !passwordEncoder.matches(
                        request.currentPassword(),
                        manager.getPassword()
                )
        ) {

            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "Current password is incorrect."
            );
        }

        if (
                passwordEncoder.matches(
                        request.newPassword(),
                        manager.getPassword()
                )
        ) {

            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different from the current password."
            );
        }

        manager.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        managerRepository.save(manager);
    }


    private String normalizeEmail(
            String email
    ) {

        return email
                .trim()
                .toLowerCase();
    }
}