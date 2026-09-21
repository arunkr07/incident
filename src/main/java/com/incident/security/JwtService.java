package com.incident.security;

import com.incident.auth.Manager;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;

    private final long expiration;

    public JwtService(
            @Value("${incident.security.jwt.secret}")
            String secret,

            @Value("${incident.security.jwt.expiration}")
            long expiration
    ) {

        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must contain at least 32 characters."
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;
    }

    public String generateToken(Manager manager) {

        Date issuedAt = new Date();

        Date expiresAt =
                new Date(
                        issuedAt.getTime() + expiration
                );

        return Jwts.builder()
                .subject(manager.getEmail())
                .claim("userId", manager.getId())
                .claim("role", manager.getRole())
                .issuedAt(issuedAt)
                .expiration(expiresAt)
                .signWith(signingKey)
                .compact();
    }

    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    public boolean isTokenValid(
            String token,
            Manager manager
    ) {

        try {

            String email =
                    extractEmail(token);

            return email.equals(manager.getEmail())
                    && !isTokenExpired(token);

        } catch (Exception exception) {

            return false;
        }
    }

    private boolean isTokenExpired(
            String token
    ) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}