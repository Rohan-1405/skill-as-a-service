package com.fusion5.skillasaservice.cms_service.dto.request;
import lombok.Data;
/** All fields optional — partial update. mode accepts "LIGHT", "DARK", or "AUTO". */
@Data
public class UpdateThemeSettingsRequest {
    private String primaryColor;
    private String secondaryColor;
    private String mode;
    private String logoUrl;
    private String faviconUrl;
    private String customCss;
}
