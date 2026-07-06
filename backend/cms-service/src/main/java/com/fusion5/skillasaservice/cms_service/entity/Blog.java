package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
@Data
public class Blog {

    public enum BlogStatus { DRAFT, PUBLISHED }

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

    @Column(length = 500)
    private String excerpt;

    /** URL to a hosted image (see storage-service) — not a binary upload here. */
    @Column(length = 1000)
    private String image;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private BlogStatus status = BlogStatus.DRAFT;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @Column(name = "seo_title", length = 255)
    private String seoTitle;

    @Column(name = "seo_description", length = 500)
    private String seoDescription;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
