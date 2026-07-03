package com.fusion5.skillasaservice.chat_service.repository;
import com.fusion5.skillasaservice.chat_service.entity.AuthUserRef;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AuthUserRefRepository extends JpaRepository<AuthUserRef, Long> {
    Optional<AuthUserRef> findByUuid(String uuid);
    Optional<AuthUserRef> findByEmail(String email);
}
