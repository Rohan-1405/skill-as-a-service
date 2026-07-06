package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "menus")
@Data
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_name", nullable = false, unique = true, length = 100)
    private String menuName;   // e.g. "header", "footer", or a custom name
}
