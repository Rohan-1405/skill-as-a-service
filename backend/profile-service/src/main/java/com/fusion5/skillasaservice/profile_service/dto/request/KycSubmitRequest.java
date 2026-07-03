package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KycSubmitRequest {
    @NotNull(message = "documentType is required: AADHAAR, PAN, PASSPORT, DRIVING_LICENSE")
    private String documentType;
    @NotBlank(message = "documentUrl is required")
    private String documentUrl;
}
