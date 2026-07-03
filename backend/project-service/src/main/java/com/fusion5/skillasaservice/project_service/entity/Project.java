package com.fusion5.skillasaservice.project_service.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "projects") @Data
public class Project {
    public enum ProjectStatus { DRAFT, ACTIVE, REVIEW, COMPLETED, CANCELLED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "client_id") private Long clientId;
    @Column(name = "freelancer_id") private Long freelancerId;
    @Column(nullable = false, length = 255) private String title;
    @Lob @Column(columnDefinition = "TEXT") private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private ProjectStatus status = ProjectStatus.DRAFT;
    @Column(name = "start_date") private LocalDate startDate;
    @Column(name = "end_date") private LocalDate endDate;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
