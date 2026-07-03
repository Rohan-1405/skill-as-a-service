package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.dto.request.ClientProfileRequest;
import com.fusion5.skillasaservice.profile_service.entity.ClientProfile;
import com.fusion5.skillasaservice.profile_service.service.ClientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile/client")
@RequiredArgsConstructor
public class ClientProfileController {

    private final ClientProfileService clientProfileService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    @ResponseStatus(HttpStatus.CREATED)
    public ClientProfile create(@RequestBody ClientProfileRequest request) {
        return clientProfileService.create(request);
    }

    @GetMapping("/{id}")
    public ClientProfile get(@PathVariable Long id) {
        return clientProfileService.get(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ClientProfile update(@PathVariable Long id, @RequestBody ClientProfileRequest request) {
        return clientProfileService.update(id, request);
    }
}
