package com.fusion5.skillasaservice.cms_service.security;

import com.fusion5.skillasaservice.cms_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.cms_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.cms_service.repository.AuthUserRefRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserResolver {

    private final AuthUserRefRepository authUserRefRepository;

    public Long getCurrentUserId() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        return authUserRefRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"))
                .getId();
    }
}
