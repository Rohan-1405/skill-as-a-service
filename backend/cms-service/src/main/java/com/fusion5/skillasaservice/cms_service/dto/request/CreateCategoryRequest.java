package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateCategoryRequest {
    @NotBlank(message = "name is required") private String name;
}
