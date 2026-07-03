package com.fusion5.skillasaservice.chat_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {
    @NotBlank(message = "content is required")
    private String content;
}
