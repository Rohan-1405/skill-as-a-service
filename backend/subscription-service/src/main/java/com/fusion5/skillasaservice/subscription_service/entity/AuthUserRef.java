package com.fusion5.skillasaservice.subscription_service.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Read-only reference into the existing `users` table, shared via auth_db.
 * subscription-service never inserts/updates rows here - exists purely to
 * resolve a JWT's UUID subject claim into the numeric user id that
 * subscription_plans.freelancer_id actually stores.
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
