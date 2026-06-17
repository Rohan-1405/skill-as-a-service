package com.fusion5.skillasaservice.profile_service.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Read-only reference into the existing `users` table (owned by auth-service,
 * shared via auth_db). profile-service never inserts/updates rows here - this
 * exists purely to resolve a JWT's UUID subject claim into the numeric user id
 * that the rest of this service's tables (freelancer_profiles, portfolios,
 * user_skills) use as their foreign key, consistent with how freelancer_id /
 * client_id are used as plain numeric user ids everywhere else in the schema.
 */
@Entity
@Table(name = "users")
@Data
public class AuthUserRef {

    @Id
    private Long id;

    @Column(unique = true)
    private String uuid;

    private String email;
}
