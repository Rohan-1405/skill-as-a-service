package com.fusion5.skillasaservice.profile_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "skills")
@Data
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "skill_name", nullable = false, unique = true)
    private String skillName;

    // Soft-delete flag - DELETE /api/admin/skills/{id} sets this false rather
    // than removing the row, so existing user_skills associations survive.
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
