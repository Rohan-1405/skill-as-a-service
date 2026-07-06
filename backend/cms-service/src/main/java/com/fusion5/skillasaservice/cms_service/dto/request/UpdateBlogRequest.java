package com.fusion5.skillasaservice.cms_service.dto.request;
import lombok.Data;
/** All fields optional — partial update. status accepts "DRAFT" or "PUBLISHED". */
@Data
public class UpdateBlogRequest {
    private String title;
    private String content;
    private String excerpt;
    private String image;
    private Long categoryId;
    private String status;
    private String seoTitle;
    private String seoDescription;
}
