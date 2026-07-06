package com.fusion5.skillasaservice.storage_service.security;

import com.fusion5.skillasaservice.storage_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.storage_service.repository.AuthUserRefRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
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

    /** Used for the delete endpoint - owner OR admin/super_admin can delete a file. */
    public boolean currentUserIsAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN") || a.equals("ROLE_SUPER_ADMIN"));
    }
}
