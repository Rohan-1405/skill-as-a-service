package com.fusion5.skillasaservice.project_service.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "milestones") @Data
public class Milestone {
    public enum MilestoneStatus { PENDING, IN_PROGRESS, COMPLETED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "project_id", nullable = false) private Long projectId;
    @Column(nullable = false, length = 255) private String title;
    @Lob @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "due_date") private LocalDate dueDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private MilestoneStatus status = MilestoneStatus.PENDING;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
