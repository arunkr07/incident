package com.incident.log;

import com.incident.service.Service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "logs")
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LogLevel level;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "trace_id", length = 100)
    private String traceId;

    @Column(name = "request_id", length = 100)
    private String requestId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}