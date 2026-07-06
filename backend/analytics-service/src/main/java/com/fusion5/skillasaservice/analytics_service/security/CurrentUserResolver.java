package com.fusion5.skillasaservice.analytics_service.security;

import com.fusion5.skillasaservice.analytics_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.analytics_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.analytics_service.repository.AuthUserRefRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserResolver {

    private final AuthUserRefRepository authUserRefRepository;

    /**
     * The JWT principal (set by JwtAuthenticationFilter) is the user's UUID,
     * not their numeric id. This resolves it against the shared auth_db users
     * table so the rest of this service can work with the numeric id that
     * subscriptions.freelancer_id / payments.payer_id / etc. actually store.
     */
    public Long getCurrentUserId() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        return authUserRefRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"))
                .getId();
    }
}
