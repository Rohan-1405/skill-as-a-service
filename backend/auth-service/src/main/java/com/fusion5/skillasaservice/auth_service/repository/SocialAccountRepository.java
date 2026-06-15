package com.fusion5.skillasaservice.auth_service.repository;

import com.fusion5.skillasaservice.auth_service.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {

    Optional<SocialAccount> findByProviderAndProviderUserId(
            SocialAccount.Provider provider, String providerUserId);
}
