package com.fusion5.skillasaservice.project_service.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "tasks") @Data
public class Task {
    public enum TaskStatus { TODO, IN_PROGRESS, REVIEW, DONE }
    public enum Priority { LOW, MEDIUM, HIGH }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "project_id", nullable = false) private Long projectId;
    @Column(name = "milestone_id") private Long milestoneId;
    @Column(name = "assigned_to") private Long assignedTo;
    @Column(name = "created_by", nullable = false) private Long createdBy;
    @Column(nullable = false, length = 255) private String title;
    @Lob @Column(columnDefinition = "TEXT") private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 15)
    private TaskStatus status = TaskStatus.TODO;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 10)
    private Priority priority = Priority.MEDIUM;
    @Column(name = "due_date") private LocalDate dueDate;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
