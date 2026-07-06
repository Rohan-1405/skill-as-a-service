package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateLanguageRequest {
    @NotBlank(message = "code is required (e.g. 'en', 'hi')") private String code;
    @NotBlank(message = "name is required") private String name;
    private boolean defaultLanguage = false;
    private boolean rtl = false;
}
