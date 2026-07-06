package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/** Global theme/branding settings — single row (id is always 1). */
@Entity
@Table(name = "theme_settings")
@Data
public class ThemeSetting {

    public enum ThemeMode { LIGHT, DARK, AUTO }

    @Id
    private Long id = 1L;

    @Column(name = "primary_color", length = 20)
    private String primaryColor = "#4F46E5";

    @Column(name = "secondary_color", length = 20)
    private String secondaryColor = "#10B981";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ThemeMode mode = ThemeMode.LIGHT;

    /** URL to a hosted image (see storage-service) — not a binary upload here. */
    @Column(name = "logo_url", length = 1000)
    private String logoUrl;

    @Column(name = "favicon_url", length = 1000)
    private String faviconUrl;

    @Lob
    @Column(name = "custom_css", columnDefinition = "TEXT")
    private String customCss;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
