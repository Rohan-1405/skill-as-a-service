package com.fusion5.skillasaservice.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs",
       indexes = {
           @Index(name = "idx_audit_user_id",  columnList = "user_id"),
           @Index(name = "idx_audit_action",   columnList = "action"),
           @Index(name = "idx_audit_created",  columnList = "created_at")
       })
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** null for anonymous events like failed logins (user id not known) */
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(length = 500)
    private String detail;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Action constants ───────────────────────────────────────────────────────
    public static final String LOGIN_SUCCESS   = "LOGIN_SUCCESS";
    public static final String LOGIN_FAILED    = "LOGIN_FAILED";
    public static final String LOGOUT          = "LOGOUT";
    public static final String REGISTER        = "REGISTER";
    public static final String SOCIAL_LOGIN    = "SOCIAL_LOGIN";
    public static final String PASSWORD_RESET  = "PASSWORD_RESET";
    public static final String TOKEN_REFRESHED = "TOKEN_REFRESHED";
    public static final String TWO_FA_ENABLED  = "2FA_ENABLED";
    public static final String TWO_FA_DISABLED = "2FA_DISABLED";
    public static final String TWO_FA_FAILED   = "2FA_FAILED";
    public static final String TWO_FA_VERIFIED = "2FA_VERIFIED";
}
