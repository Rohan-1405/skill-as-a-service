package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateBlogRequest {
    @NotBlank(message = "title is required") private String title;
    @NotBlank(message = "content is required") private String content;
    private String excerpt;
    private String image;
    private Long categoryId;
    private String seoTitle;
    private String seoDescription;
}
