package com.fusion5.skillasaservice.profile_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "freelancer_profiles")
@Data
public class FreelancerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Numeric user id (same as users.id) - one profile per user, enforced unique
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private String headline;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String bio;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "experience_years")
    private Integer experienceYears;

    private String country;

    private String city;

    private String website;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    // Plain URL string for now - real Storage Service (S3/Wasabi) upload is a later module
    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Column(name = "profile_views", nullable = false)
    private Long profileViews = 0L;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status", nullable = false)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum AvailabilityStatus {
        AVAILABLE, BUSY, UNAVAILABLE
    }
}
