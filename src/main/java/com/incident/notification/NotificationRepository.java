package com.incident.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    boolean existsByEventId(String eventId);
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByReadFalseOrderByCreatedAtDesc();
    long countByReadFalse();
}
