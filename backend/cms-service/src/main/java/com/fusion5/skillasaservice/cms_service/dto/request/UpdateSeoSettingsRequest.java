package com.fusion5.skillasaservice.cms_service.dto.request;
import lombok.Data;
@Data
public class UpdateSeoSettingsRequest {
    private String metaTitle;
    private String metaDescription;
    private String ogTitle;
    private String ogDescription;
    private String ogImage;
    private String siteUrl;
}
