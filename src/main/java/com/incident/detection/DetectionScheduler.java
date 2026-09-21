package com.incident.detection;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DetectionScheduler {

    private final DetectionEngine detectionEngine;

    public DetectionScheduler(
            DetectionEngine detectionEngine
    ) {
        this.detectionEngine = detectionEngine;
    }

    @Scheduled(fixedDelayString = "${incident.detection.interval-ms:10000}")
    public void runDetection() {

        detectionEngine.evaluateAllRules();
    }
}