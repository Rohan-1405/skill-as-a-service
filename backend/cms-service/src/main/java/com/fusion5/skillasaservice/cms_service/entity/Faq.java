package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "faqs")
@Data
public class Faq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String question;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Column(length = 100)
    private String category;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false)
    private boolean active = true;
}
