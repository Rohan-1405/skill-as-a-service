package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "languages")
@Data
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ISO 639-1 code, e.g. "en", "hi", "ar" — used as the stable key everywhere else. */
    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "is_default", nullable = false)
    private boolean defaultLanguage = false;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "is_rtl", nullable = false)
    private boolean rtl = false;
}
