package com.incident.ai.remediation;

import com.incident.incident.Incident;
import com.incident.service.Service;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "remediations")
@Getter
@Setter
public class Remediation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RemediationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RemediationStatus status;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String risk;

    @Column(columnDefinition = "TEXT")
    private String parameters;

    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    private LocalDateTime executedAt;

    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String executionMessage;

    @Column(columnDefinition = "TEXT")
    private String failureReason;

}