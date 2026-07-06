package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "roles")
@Data
public class RoleRef {
    @Id private Long id;
    @Column(name = "role_name")
    private String roleName;
}
