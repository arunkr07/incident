package com.incident.postincident;

import com.incident.incident.Incident;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "post_incident_reports")
public class PostIncidentReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "incident_id", nullable = false, unique = true)
    private Incident incident;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;
    @Column(name = "timeline_json", nullable = false, columnDefinition = "LONGTEXT")
    private String timelineJson;
    @Column(name = "probable_root_cause", nullable = false, columnDefinition = "TEXT")
    private String probableRootCause;
    @Column(name = "evidence_json", nullable = false, columnDefinition = "LONGTEXT")
    private String evidenceJson;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String impact;
    @Column(name = "corrective_actions_json", nullable = false, columnDefinition = "LONGTEXT")
    private String correctiveActionsJson;
    @Column(name = "preventive_actions_json", nullable = false, columnDefinition = "LONGTEXT")
    private String preventiveActionsJson;
    @Column(length = 100)
    private String model;
    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }
    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }
}
