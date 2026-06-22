package com.fusion5.skillasaservice.wallet_service.entity;

import jakarta.persistence.*;
import lombok.Data;

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
