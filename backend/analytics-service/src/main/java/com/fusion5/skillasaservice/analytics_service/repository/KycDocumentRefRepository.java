package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.KycDocumentRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KycDocumentRefRepository extends JpaRepository<KycDocumentRef, Long> {

    long countByVerificationStatus(KycDocumentRef.VerificationStatus status);

    @Query("select k.submittedAt, k.reviewedAt from KycDocumentRef k where k.reviewedAt is not null")
    List<Object[]> reviewedTimestamps();
}
