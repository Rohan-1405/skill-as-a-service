package com.fusion5.skillasaservice.notification_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class AuthUserRef {
    @Id private Long id;
    @Column(unique = true) private String uuid;
    private String email;
    @Column(name = "first_name") private String firstName;
    @Column(name = "last_name") private String lastName;
}
