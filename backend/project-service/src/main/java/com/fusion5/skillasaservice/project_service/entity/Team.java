package com.fusion5.skillasaservice.project_service.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "teams") @Data
public class Team {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "project_id", nullable = false, unique = true) private Long projectId;
    @Column(nullable = false, length = 255) private String name;
    @Column(name = "owner_id", nullable = false) private Long ownerId;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
