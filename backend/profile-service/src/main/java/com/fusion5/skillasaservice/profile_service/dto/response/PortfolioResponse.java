package com.fusion5.skillasaservice.profile_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PortfolioResponse {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String imageUrl;
    private String projectUrl;
    private LocalDateTime createdAt;
}
