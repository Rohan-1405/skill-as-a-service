package com.fusion5.skillasaservice.profile_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "client_profiles")
@Data
public class ClientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "company_name", length = 255)
    private String companyName;

    @Column(name = "company_size", length = 50)
    private String companySize;   // "1-10", "11-50", "51-200", "201-500", "500+"

    @Column(length = 100)
    private String industry;

    @Column(length = 255)
    private String website;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String city;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bio;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
