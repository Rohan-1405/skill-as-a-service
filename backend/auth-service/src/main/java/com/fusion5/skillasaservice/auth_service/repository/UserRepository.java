package com.fusion5.skillasaservice.auth_service.repository;

import com.fusion5.skillasaservice.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUuid(String uuid);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
}