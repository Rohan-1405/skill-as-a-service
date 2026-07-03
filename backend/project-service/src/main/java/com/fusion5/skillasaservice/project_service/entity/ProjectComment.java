package com.fusion5.skillasaservice.project_service.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "project_comments") @Data
public class ProjectComment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "project_id", nullable = false) private Long projectId;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Lob @Column(columnDefinition = "TEXT", nullable = false) private String content;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
