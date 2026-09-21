package com.incident.detection;

import com.incident.incident.IncidentSeverity;
import com.incident.service.Service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "detection_rules")
public class DetectionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "metric_type", nullable = false, length = 50)
    private DetectionMetricType metricType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DetectionOperator operator;

    @Column(nullable = false)
    private Double threshold;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IncidentSeverity severity;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(name = "evaluation_window_seconds", nullable = false)
    private Integer evaluationWindowSeconds = 60;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}