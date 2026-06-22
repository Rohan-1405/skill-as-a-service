package com.fusion5.skillasaservice.payment_service.security;
import com.fusion5.skillasaservice.payment_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.payment_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.payment_service.repository.AuthUserRefRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
@Component
public class CurrentUserResolver {
    private final AuthUserRefRepository repo;
    public CurrentUserResolver(AuthUserRefRepository repo) { this.repo = repo; }
    public Long getCurrentUserId() {
        String uuid = SecurityContextHolder.getContext().getAuthentication().getName();
        AuthUserRef user = repo.findByUuid(uuid).orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        return user.getId();
    }
}
