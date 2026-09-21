package com.incident.metric;

import com.incident.service.Service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "metrics")
public class Metric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "metric_type", nullable = false, length = 50)
    private String metricType;

    @Column(name = "metric_value", nullable = false)
    private Double metricValue;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();

        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }
}