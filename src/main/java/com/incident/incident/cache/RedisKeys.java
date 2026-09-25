package com.incident.incident.cache;

public final class RedisKeys {

    private RedisKeys() {}

    public static String activeIncident(Long serviceId) {
        return "incident:active:" + serviceId;
    }

    public static String serviceHealth(Long serviceId) {
        return "service:health:" + serviceId;
    }

    public static String serviceMetrics(Long serviceId) {
        return "service:metrics:" + serviceId;
    }

    public static String investigation(Long incidentId) {
        return "investigation:" + incidentId;
    }
}