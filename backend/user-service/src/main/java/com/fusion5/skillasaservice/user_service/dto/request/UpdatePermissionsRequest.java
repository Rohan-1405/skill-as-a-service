package com.fusion5.skillasaservice.user_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/** Full-replace semantics — same as AssignRolesRequest for roles. */
@Data
public class UpdatePermissionsRequest {
    @NotNull(message = "permissions is required (send an empty list to clear all permissions)")
    private List<String> permissions;
}
