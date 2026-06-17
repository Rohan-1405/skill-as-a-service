package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddPortfolioItemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String imageUrl;
    private String projectUrl;
}
