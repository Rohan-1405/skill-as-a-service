package com.fusion5.skillasaservice.cms_service.dto.request;
import lombok.Data;
/** All fields optional. status accepts "DRAFT" or "PUBLISHED". */
@Data
public class UpdatePageRequest {
    private String title;
    private String content;
    private String status;
    private String seoTitle;
    private String seoDescription;
}
