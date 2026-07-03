package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateCommentRequest {
    @NotBlank(message = "content is required") private String content;
}
