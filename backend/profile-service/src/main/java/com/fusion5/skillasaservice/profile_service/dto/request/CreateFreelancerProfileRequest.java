package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateFreelancerProfileRequest {

    @NotBlank(message = "Headline is required")
    private String headline;

    @NotBlank(message = "Bio is required")
    private String bio;

    @PositiveOrZero(message = "Hourly rate must be zero or positive")
    private BigDecimal hourlyRate;

    @PositiveOrZero(message = "Experience years must be zero or positive")
    private Integer experienceYears;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "City is required")
    private String city;

    private String website;
    private String linkedinUrl;
    private String githubUrl;
    private String profileImage;
}
