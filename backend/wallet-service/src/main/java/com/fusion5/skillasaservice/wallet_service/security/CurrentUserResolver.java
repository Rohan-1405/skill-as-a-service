package com.fusion5.skillasaservice.wallet_service.security;

import com.fusion5.skillasaservice.wallet_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.wallet_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.wallet_service.repository.AuthUserRefRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserResolver {

    private final AuthUserRefRepository authUserRefRepository;

    public CurrentUserResolver(AuthUserRefRepository authUserRefRepository) {
        this.authUserRefRepository = authUserRefRepository;
    }

    public Long getCurrentUserId() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthUserRef user = authUserRefRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        return user.getId();
    }
}
