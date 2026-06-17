package com.fusion5.skillasaservice.profile_service.dto.response;

import com.fusion5.skillasaservice.profile_service.entity.FreelancerProfile;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class FreelancerProfileResponse {
    private Long id;
    private Long userId;
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
    private Long profileViews;
    private FreelancerProfile.AvailabilityStatus availabilityStatus;
    private List<SkillResponse> skills;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
