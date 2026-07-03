package com.fusion5.skillasaservice.chat_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Attaches an already-hosted file to a room (e.g. a URL the client obtained from a
 * presigned-upload flow). This service does NOT accept raw binary uploads —
 * that requires cloud-storage-service, which is not built yet (Phase 2 backlog).
 */
@Data
public class SendAttachmentRequest {
    @NotBlank(message = "attachmentUrl is required")
    private String attachmentUrl;

    private String attachmentName;

    @NotBlank(message = "attachmentType is required (e.g. image, file)")
    private String attachmentType;
}
