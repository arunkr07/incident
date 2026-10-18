package com.incident.notification.dto;

import com.incident.notification.Notification;
import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String eventId,
        String type,
        String title,
        String description,
        Long incidentId,
        boolean read,
        LocalDateTime timestamp
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getEventId(), n.getType(), n.getTitle(),
                n.getDescription(), n.getIncidentId(), n.isRead(), n.getCreatedAt()
        );
    }
}
