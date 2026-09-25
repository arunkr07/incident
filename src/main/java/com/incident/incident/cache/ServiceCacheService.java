package com.incident.incident.cache;

import com.incident.service.Service;

import java.time.Duration;

@org.springframework.stereotype.Service
public class ServiceCacheService {

    private final RedisCacheService redis;

    public ServiceCacheService(
            RedisCacheService redis
    ) {
        this.redis = redis;
    }

    public void cacheHealth(
            Service service
    ) {

        redis.set(
                RedisKeys.serviceHealth(
                        service.getId()
                ),
                service.getStatus(),
                Duration.ofSeconds(30)
        );
    }

    public String getHealth(Long serviceId) {

        return redis.get(
                RedisKeys.serviceHealth(serviceId),
                String.class
        );
    }

    public void clearHealth(Long serviceId) {

        redis.delete(
                RedisKeys.serviceHealth(serviceId)
        );
    }
}