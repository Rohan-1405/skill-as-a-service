package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateFaqRequest {
    @NotBlank(message = "question is required") private String question;
    @NotBlank(message = "answer is required") private String answer;
    private String category;
    private Integer sortOrder = 0;
}
