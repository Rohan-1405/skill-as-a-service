package com.fusion5.skillasaservice.profile_service.security;

import com.fusion5.skillasaservice.profile_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.AuthUserRefRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserResolver {

    private final AuthUserRefRepository authUserRefRepository;

    public CurrentUserResolver(AuthUserRefRepository authUserRefRepository) {
        this.authUserRefRepository = authUserRefRepository;
    }

    /**
     * The JWT principal (set by JwtAuthenticationFilter) is the user's UUID,
     * not their numeric id. This resolves it against the shared auth_db users
     * table so the rest of this service can work with the numeric id that
     * freelancer_profiles.user_id / portfolios.user_id / user_skills.user_id
     * actually store.
     */
    public Long getCurrentUserId() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthUserRef user = authUserRefRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        return user.getId();
    }
}
