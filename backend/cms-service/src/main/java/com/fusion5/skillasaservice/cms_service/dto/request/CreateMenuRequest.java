package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateMenuRequest {
    @NotBlank(message = "menuName is required") private String menuName;
}
