package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class MenuItemRequest {
    @NotBlank(message = "label is required") private String label;
    @NotBlank(message = "url is required") private String url;
    private Integer sortOrder = 0;
    private Long parentId;
}
