package com.fusion5.skillasaservice.subscription_service.security;

import com.fusion5.skillasaservice.subscription_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.subscription_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.subscription_service.repository.AuthUserRefRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserResolver {

    private final AuthUserRefRepository authUserRefRepository;

    public CurrentUserResolver(AuthUserRefRepository authUserRefRepository) {
        this.authUserRefRepository = authUserRefRepository;
    }

    /**
     * JWT principal (set by JwtAuthenticationFilter) is the user's UUID, not
     * their numeric id. Resolves it against the shared auth_db users table so
     * subscription_plans.freelancer_id can be compared against it directly.
     */
    public Long getCurrentUserId() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthUserRef user = authUserRefRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        return user.getId();
    }
}
