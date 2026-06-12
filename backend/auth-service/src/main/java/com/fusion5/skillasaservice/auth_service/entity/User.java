package com.fusion5.skillasaservice.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(nullable = false, unique = true)
    private String uuid = UUID.randomUUID().toString();

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String mobile;

    private String password;

    @Column(name = "profile_image")
    private String profileImage;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.INACTIVE;

    @Builder.Default
    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Builder.Default
    @Column(name = "two_fa_enabled")
    private Boolean twoFaEnabled = false;

    @Column(name = "two_fa_secret")
    private String twoFaSecret;

    @Builder.Default
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED, BLOCKED
    }
}