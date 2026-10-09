package com.incident.incident.event;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaEventPublisher(
            KafkaTemplate<String, Object> kafkaTemplate
    ) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishIncidentCreated(
            IncidentEvent event
    ) {
        publish(
                "incident.created",
                event.incidentKey(),
                event
        );
    }

    public void publishIncidentAcknowledged(
            IncidentEvent event
    ) {
        publish(
                "incident.acknowledged",
                event.incidentKey(),
                event
        );
    }

    public void publishInvestigationStarted(
            IncidentEvent event
    ) {
        publish(
                "incident.investigation.started",
                event.incidentKey(),
                event
        );
    }

    public void publishIncidentResolved(
            IncidentEvent event
    ) {
        publish(
                "incident.resolved",
                event.incidentKey(),
                event
        );
    }

    public void publishIncidentReopened(
            IncidentEvent event
    ) {
        publish(
                "incident.reopened",
                event.incidentKey(),
                event
        );
    }

    public void publishAIInvestigationCompleted(
            IncidentEvent event
    ) {
        publish(
                "ai.investigation.completed",
                event.incidentKey(),
                event
        );
    }

    public void publishDetectionTriggered(
            DetectionEvent event
    ) {
        publish(
                "detection.triggered",
                String.valueOf(event.ruleId()),
                event
        );
    }

    public void publishDeploymentCreated(
            DeploymentEvent event
    ) {
        publish(
                "deployment.created",
                String.valueOf(event.deploymentId()),
                event
        );
    }

    public void publishDeploymentCompleted(
            DeploymentEvent event
    ) {
        publish(
                "deployment.completed",
                String.valueOf(event.deploymentId()),
                event
        );
    }

    private void publish(
            String topic,
            String key,
            Object event
    ) {

        kafkaTemplate.send(
                topic,
                key,
                event
        );
    }
}