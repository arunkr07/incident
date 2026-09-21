package com.incident.dependency;

import com.incident.service.Service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(
        name = "service_dependencies",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_service_dependency",
                        columnNames = {
                                "source_service_id",
                                "target_service_id"
                        }
                )
        }
)
public class ServiceDependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_service_id", nullable = false)
    private Service sourceService;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_service_id", nullable = false)
    private Service targetService;

    @Column(name = "dependency_type", nullable = false, length = 50)
    private String dependencyType = "SYNCHRONOUS";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}