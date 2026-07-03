package com.fusion5.skillasaservice.profile_service.dto.request;

import lombok.Data;

@Data
public class ClientProfileRequest {
    private String companyName;
    private String companySize;
    private String industry;
    private String website;
    private String country;
    private String city;
    private String bio;
}
