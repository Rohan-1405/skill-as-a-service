package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Read-only mirror of auth-service's `users` table (+ its user_roles/roles join),
 * same pattern as every other service's AuthUserRef, extended here with the roles
 * relation since analytics needs role-based counts (freelancers vs clients).
 * Analytics-service never writes to this table — read/aggregate only.
 */
@Entity
@Table(name = "users")
@Data
public class AuthUserRef {

    @Id private Long id;
    @Column(unique = true) private String uuid;
    @Column(name = "first_name") private String firstName;
    @Column(name = "last_name") private String lastName;
    private String email;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<RoleRef> roles;

    public enum UserStatus { ACTIVE, INACTIVE, SUSPENDED, BLOCKED }
}
