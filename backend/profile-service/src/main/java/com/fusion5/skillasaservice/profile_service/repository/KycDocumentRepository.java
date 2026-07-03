package com.fusion5.skillasaservice.profile_service.repository;

import com.fusion5.skillasaservice.profile_service.entity.KycDocument;
import com.fusion5.skillasaservice.profile_service.entity.KycDocument.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
    List<KycDocument> findByUserId(Long userId);
    Page<KycDocument> findByVerificationStatus(VerificationStatus status, Pageable pageable);
}
