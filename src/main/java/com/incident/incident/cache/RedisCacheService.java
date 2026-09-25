package com.incident.incident.cache;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class RedisCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    public boolean isActive(Long serviceId) {

        String key = RedisKeys.activeIncident(serviceId);

        Boolean exists = redisTemplate.hasKey(key);

        return Boolean.TRUE.equals(exists);
    }

    public RedisCacheService(
            RedisTemplate<String, Object> redisTemplate
    ) {
        this.redisTemplate = redisTemplate;
    }

    public void set(
            String key,
            Object value,
            Duration ttl
    ) {

        redisTemplate.opsForValue()
                .set(key, value, ttl);
    }

    public Object get(String key) {

        return redisTemplate.opsForValue()
                .get(key);
    }

    public <T> T get(
            String key,
            Class<T> type
    ) {

        Object value = get(key);

        if (value == null) {
            return null;
        }

        return type.cast(value);
    }

    public boolean exists(String key) {

        Boolean exists =
                redisTemplate.hasKey(key);

        return Boolean.TRUE.equals(exists);
    }

    public void delete(String key) {

        redisTemplate.delete(key);
    }

    public boolean setIfAbsent(
            String key,
            Object value,
            Duration ttl
    ) {

        Boolean result =
                redisTemplate.opsForValue()
                        .setIfAbsent(
                                key,
                                value,
                                ttl
                        );

        return Boolean.TRUE.equals(result);
    }

    public void expire(
            String key,
            Duration duration
    ) {

        redisTemplate.expire(
                key,
                duration.toMillis(),
                TimeUnit.MILLISECONDS
        );
    }
}