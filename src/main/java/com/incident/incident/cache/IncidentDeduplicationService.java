package com.incident.incident.cache;

import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class IncidentDeduplicationService {

    private final RedisCacheService redisCacheService;

    public IncidentDeduplicationService(
            RedisCacheService redisCacheService
    ) {
        this.redisCacheService = redisCacheService;
    }

    public boolean claim(Long serviceId) {

        String key =
                RedisKeys.activeIncident(serviceId);

        return redisCacheService.setIfAbsent(
                key,
                "ACTIVE",
                Duration.ofHours(24)
        );
    }

    public void clear(Long serviceId) {

        redisCacheService.delete(
                RedisKeys.activeIncident(serviceId)
        );
    }

    public boolean isActive(Long serviceId) {

        return redisCacheService.exists(
                RedisKeys.activeIncident(serviceId)
        );
    }
}