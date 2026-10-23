package com.incident.notification;

import com.incident.common.exception.ApiException;
import com.incident.notification.dto.NotificationResponse;
import com.incident.notification.dto.UnreadCountResponse;
import com.incident.settings.ManagerSettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class NotificationService {
    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ManagerSettingsService managerSettingsService;

    public NotificationService(
            NotificationRepository repository,
            SimpMessagingTemplate messagingTemplate,
            ManagerSettingsService managerSettingsService
    ) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
        this.managerSettingsService = managerSettingsService;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getAll(boolean unreadOnly) {
        return getAll(unreadOnly, null);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getAll(boolean unreadOnly, String managerEmail) {
        List<Notification> notifications = unreadOnly
                ? repository.findByReadFalseOrderByCreatedAtDesc()
                : repository.findAllByOrderByCreatedAtDesc();
        Map<String, Object> preferences = notificationPreferences(managerEmail);
        return notifications.stream()
                .filter(notification -> isEnabled(notification, preferences))
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount() {
        return new UnreadCountResponse(repository.countByReadFalse());
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(String managerEmail) {
        return new UnreadCountResponse(getAll(true, managerEmail).size());
    }

    private Map<String, Object> notificationPreferences(String managerEmail) {
        if (managerEmail == null) return Map.of();
        Map<String, Object> settings = managerSettingsService.getForEmail(managerEmail);
        Object configured = settings.get("notifications");
        if (!(configured instanceof Map<?, ?> raw)) return Map.of();
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        for (Map.Entry<?, ?> entry : raw.entrySet()) {
            if (entry.getKey() instanceof String key) result.put(key, entry.getValue());
        }
        return result;
    }

    private boolean isEnabled(Notification notification, Map<String, Object> preferences) {
        String type = ((notification.getType() == null ? "" : notification.getType()) + " "
                + (notification.getTitle() == null ? "" : notification.getTitle())).toUpperCase();
        String key;
        if (type.contains("AI") || type.contains("INVESTIGATION")) key = "aiCompleted";
        else if (type.contains("DEPLOY")) key = "deploymentEvents";
        else if (type.contains("SERVICE") || type.contains("DEGRAD")) key = "serviceDegraded";
        else if (type.contains("RECOVER") || type.contains("RESOLV")) key = "recoveryEvents";
        else if (type.contains("CRITICAL")) key = "criticalIncidents";
        else key = "newIncidents";
        return !preferences.containsKey(key) || Boolean.TRUE.equals(preferences.get(key));
    }

    @Transactional
    public NotificationResponse markRead(Long id) {
        Notification n = repository.findById(id).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "Notification not found"));
        n.setRead(true);
        return NotificationResponse.from(repository.save(n));
    }

    @Transactional
    public long markAllRead() {
        List<Notification> unread = repository.findByReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        repository.saveAll(unread);
        return unread.size();
    }

    @Transactional
    public void createIfAbsent(
            String eventId,
            String type,
            String title,
            String description,
            Long incidentId
    ) {
        if (eventId != null && repository.existsByEventId(eventId)) return;

        Notification n = new Notification();
        n.setEventId(eventId);
        n.setType(type);
        n.setTitle(title);
        n.setDescription(description);
        n.setIncidentId(incidentId);
        Notification saved = repository.saveAndFlush(n);
        messagingTemplate.convertAndSend("/topic/notifications",
                NotificationResponse.from(saved));
    }
}
