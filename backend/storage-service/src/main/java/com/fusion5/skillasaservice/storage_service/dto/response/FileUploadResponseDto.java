package com.fusion5.skillasaservice.storage_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class FileUploadResponseDto {
    private String fileKey;
    private String url;
    private String fileName;
    private String fileType;
    private long sizeBytes;
}
