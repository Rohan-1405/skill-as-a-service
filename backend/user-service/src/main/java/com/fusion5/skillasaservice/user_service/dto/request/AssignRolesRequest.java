package com.fusion5.skillasaservice.user_service.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AssignRolesRequest {

    @NotEmpty(message = "At least one role must be provided")
    private Set<String> roles; // e.g. ["ADMIN", "FREELANCER"]
}
