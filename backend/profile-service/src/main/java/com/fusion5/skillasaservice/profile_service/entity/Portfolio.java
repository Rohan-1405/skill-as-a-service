package com.fusion5.skillasaservice.profile_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "portfolios")
@Data
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String description;

    // Plain URL string for now - see profile_image note in FreelancerProfile
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "project_url", length = 500)
    private String projectUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
