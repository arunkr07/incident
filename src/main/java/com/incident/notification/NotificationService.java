package com.incident.notification;

import com.incident.common.exception.ApiException;
import com.incident.notification.dto.NotificationResponse;
import com.incident.notification.dto.UnreadCountResponse;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(
            NotificationRepository repository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getAll(boolean unreadOnly) {
        return (unreadOnly
                ? repository.findByReadFalseOrderByCreatedAtDesc()
                : repository.findAllByOrderByCreatedAtDesc())
                .stream().map(NotificationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount() {
        return new UnreadCountResponse(repository.countByReadFalse());
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
