package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "translations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"language_code", "translation_key"}))
@Data
public class Translation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    /** e.g. "home.hero.title", "nav.browse_freelancers" — a stable dot-path key the
     *  frontend looks up, same key across every language row. */
    @Column(name = "translation_key", nullable = false, length = 255)
    private String translationKey;

    @Lob
    @Column(name = "translation_value", columnDefinition = "TEXT", nullable = false)
    private String translationValue;
}
