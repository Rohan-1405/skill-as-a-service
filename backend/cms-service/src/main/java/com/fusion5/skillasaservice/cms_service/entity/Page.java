package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/** Static pages — About Us, Contact, Terms, Privacy Policy, etc. */
@Entity
@Table(name = "pages")
@Data
public class Page {

    public enum PageStatus { DRAFT, PUBLISHED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 280)
    private String slug;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

    @Column(name = "seo_title", length = 255)
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    private String seoDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PageStatus status = PageStatus.DRAFT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
