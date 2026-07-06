package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreatePageRequest {
    @NotBlank(message = "title is required") private String title;
    @NotBlank(message = "content is required") private String content;
    private String seoTitle;
    private String seoDescription;
}
