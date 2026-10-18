package com.incident.notification;

import com.incident.notification.dto.NotificationResponse;
import com.incident.notification.dto.UnreadCountResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<NotificationResponse> getAll(
            @RequestParam(defaultValue = "false") boolean unreadOnly
    ) {
        return service.getAll(unreadOnly);
    }

    @GetMapping("/unread-count")
    public UnreadCountResponse getUnreadCount() {
        return service.getUnreadCount();
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse markRead(@PathVariable Long id) {
        return service.markRead(id);
    }

    @PatchMapping("/read-all")
    public Map<String, Long> markAllRead() {
        return Map.of("updatedCount", service.markAllRead());
    }
}
