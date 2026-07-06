package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/** Read-only mirror of project-service's `projects` table. */
@Entity
@Table(name = "projects")
@Data
public class ProjectRef {

    @Id private Long id;

    @Column(name = "client_id") private Long clientId;
    @Column(name = "freelancer_id") private Long freelancerId;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum ProjectStatus { DRAFT, ACTIVE, REVIEW, COMPLETED, CANCELLED }
}
