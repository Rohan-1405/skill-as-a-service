package com.fusion5.skillasaservice.storage_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class PresignedUrlResponseDto {
    private String fileKey;
    private String uploadUrl;
    private String httpMethod;
    private int expiresInSeconds;
    private String note;
}
