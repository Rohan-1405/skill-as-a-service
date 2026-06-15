package com.fusion5.skillasaservice.auth_service.dto.oauth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleUserInfoResponse {
    private String sub;
    private String email;
    private Boolean email_verified;
    private String name;
    private String given_name;
    private String family_name;
    private String picture;
}
