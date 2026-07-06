package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Global site-wide SEO defaults. Intentionally a single row (id is always 1) — per-page
 * SEO overrides already exist on Blog (seoTitle/seoDescription) and Page (seoTitle/
 * seoDescription); this table is only the site-wide fallback, not a per-URL table.
 */
@Entity
@Table(name = "seo_settings")
@Data
public class SeoSetting {
    @Id
    private Long id = 1L;

    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @Column(name = "meta_description", length = 500)
    private String metaDescription;

    @Column(name = "og_title", length = 255)
    private String ogTitle;

    @Column(name = "og_description", length = 500)
    private String ogDescription;

    @Column(name = "og_image", length = 1000)
    private String ogImage;

    @Column(name = "site_url", length = 500)
    private String siteUrl;   // used to build sitemap.xml <loc> entries

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
