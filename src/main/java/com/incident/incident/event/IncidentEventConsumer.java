package com.incident.incident.event;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class IncidentEventConsumer {

    @KafkaListener(
            topics = "incident.created",
            groupId = "incident-notification-consumer",
            containerFactory = "incidentKafkaListenerContainerFactory"
    )
    public void onIncidentCreated(
            IncidentEvent event
    ) {

    }

    @KafkaListener(
            topics = "incident.acknowledged",
            groupId = "incident-audit-consumer",
            containerFactory = "incidentKafkaListenerContainerFactory"
    )
    public void onIncidentAcknowledged(
            IncidentEvent event
    ) {

    }

    @KafkaListener(
            topics = "incident.resolved",
            groupId = "incident-audit-consumer",
            containerFactory = "incidentKafkaListenerContainerFactory"
    )
    public void onIncidentResolved(
            IncidentEvent event
    ) {

    }
}