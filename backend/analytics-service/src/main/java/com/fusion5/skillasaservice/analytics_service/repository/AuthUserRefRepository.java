package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.AuthUserRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuthUserRefRepository extends JpaRepository<AuthUserRef, Long> {

    Optional<AuthUserRef> findByUuid(String uuid);

    long countByStatus(AuthUserRef.UserStatus status);

    long countByCreatedAtAfter(LocalDateTime after);

    @Query("select count(distinct u) from AuthUserRef u join u.roles r where r.roleName = :roleName")
    long countByRole(@Param("roleName") String roleName);

    @Query(value = "select DATE_FORMAT(created_at, '%Y-%m') as month, count(*) as cnt " +
            "from users where created_at >= :since group by month order by month",
            nativeQuery = true)
    List<Object[]> monthlyRegistrations(@Param("since") LocalDateTime since);
}
