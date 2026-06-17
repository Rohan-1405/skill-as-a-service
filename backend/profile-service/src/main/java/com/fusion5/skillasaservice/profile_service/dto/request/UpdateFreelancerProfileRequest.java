package com.fusion5.skillasaservice.profile_service.dto.request;

import com.fusion5.skillasaservice.profile_service.entity.FreelancerProfile;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateFreelancerProfileRequest {

    private String headline;
    private String bio;
    private BigDecimal hourlyRate;
    private Integer experienceYears;
    private String country;
    private String city;
    private String website;
    private String linkedinUrl;
    private String githubUrl;
    private String profileImage;
    private FreelancerProfile.AvailabilityStatus availabilityStatus;
}
