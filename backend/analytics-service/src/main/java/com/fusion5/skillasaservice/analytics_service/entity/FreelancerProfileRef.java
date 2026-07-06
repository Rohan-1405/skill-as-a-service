package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;

/** Read-only mirror of profile-service's `freelancer_profiles` table (subset of columns). */
@Entity
@Table(name = "freelancer_profiles")
@Data
public class FreelancerProfileRef {

    @Id private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "profile_views")
    private Long profileViews;
}
