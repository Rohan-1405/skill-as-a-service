package com.fusion5.skillasaservice.profile_service.repository;

import com.fusion5.skillasaservice.profile_service.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByUserIdOrderByIssueDateDesc(Long userId);
}
