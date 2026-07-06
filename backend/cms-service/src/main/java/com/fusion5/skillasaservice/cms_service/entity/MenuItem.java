package com.fusion5.skillasaservice.cms_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "menu_items")
@Data
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id", nullable = false)
    private Long menuId;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    /** Null for a top-level item; set for a nested/dropdown child item. */
    @Column(name = "parent_id")
    private Long parentId;
}
