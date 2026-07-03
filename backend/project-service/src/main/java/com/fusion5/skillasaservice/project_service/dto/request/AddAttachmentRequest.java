package com.fusion5.skillasaservice.project_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** fileUrl must point to an already-hosted file — see ProjectAttachment entity note. */
@Data
public class AddAttachmentRequest {
    @NotBlank(message = "fileUrl is required")
    private String fileUrl;

    private String fileName;
    private String fileType;
}
