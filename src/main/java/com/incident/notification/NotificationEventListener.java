package com.incident.notification;

import com.incident.incident.event.DeploymentEvent;
import com.incident.incident.event.DetectionEvent;
import com.incident.incident.event.IncidentEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {
    private final NotificationService notifications;

    public NotificationEventListener(NotificationService notifications) {
        this.notifications = notifications;
    }

    @KafkaListener(topics = {
            "incident.created", "incident.acknowledged",
            "incident.investigation.started", "incident.resolved", "incident.reopened",
            "ai.investigation.completed"
    }, groupId = "incident-notification-v1",
       containerFactory = "incidentKafkaListenerContainerFactory")
    public void onIncidentEvent(IncidentEvent event) {
        if (event == null || event.eventType() == null) return;
        String type;
        String title;
        switch (event.eventType()) {
            case INCIDENT_CREATED -> { type = "CRITICAL".equals(event.severity()) ? "CRITICAL" : "INCIDENT"; title = "Incident created"; }
            case INCIDENT_ACKNOWLEDGED -> { type = "INCIDENT"; title = "Incident acknowledged"; }
            case INCIDENT_INVESTIGATION_STARTED -> { type = "AI"; title = "Incident investigation started"; }
            case INCIDENT_RESOLVED -> { type = "RECOVERY"; title = "Incident resolved"; }
            case INCIDENT_REOPENED -> { type = "CRITICAL"; title = "Incident reopened"; }
            case AI_INVESTIGATION_COMPLETED -> { type = "AI"; title = "AI investigation completed"; }
            default -> { return; }
        }
        notifications.createIfAbsent(
                event.eventId() == null ? null : event.eventId().toString(),
                type, title,
                event.title() + " — service: " + event.serviceName()
                        + ", severity: " + event.severity()
                        + ", status: " + event.status(),
                event.incidentId()
        );
    }

    @KafkaListener(topics = {"deployment.created", "deployment.completed"},
            groupId = "incident-notification-v1",
            containerFactory = "notificationObjectKafkaListenerContainerFactory")
    public void onDeploymentEvent(DeploymentEvent event) {
        if (event == null) return;
        boolean completed = "COMPLETED".equals(event.status());
        notifications.createIfAbsent(
                event.eventId() == null ? null : event.eventId().toString(),
                "DEPLOYMENT",
                completed ? "Deployment completed" : "Deployment started",
                "Service: " + event.serviceName() + ", version: " + event.version()
                        + ", status: " + event.status(),
                null
        );
    }

    @KafkaListener(topics = "detection.triggered",
            groupId = "incident-notification-v1",
            containerFactory = "notificationObjectKafkaListenerContainerFactory")
    public void onDetectionEvent(DetectionEvent event) {
        if (event == null) return;
        notifications.createIfAbsent(
                event.eventId() == null ? null : event.eventId().toString(),
                "CRITICAL",
                "Detection rule triggered",
                "Rule: " + event.ruleName() + ", service: " + event.serviceName()
                        + ", metric: " + event.metricType() + ", actual value: "
                        + event.actualValue() + ", threshold: " + event.threshold(),
                null
        );
    }
}
