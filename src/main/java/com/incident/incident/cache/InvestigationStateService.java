package com.incident.incident.cache;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

@Service
public class InvestigationStateService {

    private final RedisCacheService redis;

    public InvestigationStateService(
            RedisCacheService redis
    ) {
        this.redis = redis;
    }

    public void saveState(
            Long incidentId,
            Map<String, Object> state
    ) {

        redis.set(
                RedisKeys.investigation(incidentId),
                state,
                Duration.ofMinutes(30)
        );
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getState(
            Long incidentId
    ) {

        return redis.get(
                RedisKeys.investigation(incidentId),
                Map.class
        );
    }

    public void clearState(Long incidentId) {

        redis.delete(
                RedisKeys.investigation(incidentId)
        );
    }
}