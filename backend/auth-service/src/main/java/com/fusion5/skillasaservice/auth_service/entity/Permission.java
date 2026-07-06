package com.fusion5.skillasaservice.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;

/** Mirrors user-service's Permission entity — same physical `permissions` table.
 *  auth-service only reads this (at login/refresh, to embed in the JWT); user-service
 *  owns the write side (the admin-facing permission-management endpoints). */
@Entity
@Table(name = "permissions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "permission_name", nullable = false, unique = true)
    private String permissionName;
}
