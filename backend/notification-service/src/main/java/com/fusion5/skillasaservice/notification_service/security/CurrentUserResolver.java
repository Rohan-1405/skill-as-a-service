package com.fusion5.skillasaservice.notification_service.security;

import com.fusion5.skillasaservice.notification_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.notification_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.notification_service.repository.AuthUserRefRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserResolver {

    private final AuthUserRefRepository authUserRefRepository;

    public Long getCurrentUserId() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUuid(uuid).getId();
    }

    public AuthUserRef getCurrentUser() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUuid(uuid);
    }

    private AuthUserRef getByUuid(String uuid) {
        return authUserRefRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
