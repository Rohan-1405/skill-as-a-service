package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.dto.request.KycRejectRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.KycSubmitRequest;
import com.fusion5.skillasaservice.profile_service.entity.KycDocument;
import com.fusion5.skillasaservice.profile_service.entity.KycDocument.DocumentType;
import com.fusion5.skillasaservice.profile_service.entity.KycDocument.VerificationStatus;
import com.fusion5.skillasaservice.profile_service.exception.BadRequestException;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.KycDocumentRepository;
import com.fusion5.skillasaservice.profile_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KycService {

    private final KycDocumentRepository kycRepo;
    private final CurrentUserResolver   currentUserResolver;

    /** Freelancer submits a KYC document for review */
    @Transactional
    public KycDocument submit(KycSubmitRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();

        DocumentType docType;
        try {
            docType = DocumentType.valueOf(req.getDocumentType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid documentType: " + req.getDocumentType()
                    + ". Valid values: AADHAAR, PAN, PASSPORT, DRIVING_LICENSE");
        }

        KycDocument doc = new KycDocument();
        doc.setUserId(userId);
        doc.setDocumentType(docType);
        doc.setDocumentUrl(req.getDocumentUrl());
        doc.setVerificationStatus(VerificationStatus.PENDING);
        return kycRepo.save(doc);
    }

    /** Freelancer checks their own KYC submissions */
    public List<KycDocument> myStatus() {
        Long userId = currentUserResolver.getCurrentUserId();
        return kycRepo.findByUserId(userId);
    }

    /** Admin: list all submissions, optionally filtered by status */
    public Page<KycDocument> listAll(String status, Pageable pageable) {
        if (status != null) {
            VerificationStatus vs;
            try {
                vs = VerificationStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status. Valid: PENDING, APPROVED, REJECTED");
            }
            return kycRepo.findByVerificationStatus(vs, pageable);
        }
        return kycRepo.findAll(pageable);
    }

    /** Admin: approve a document */
    @Transactional
    public KycDocument approve(Long docId) {
        Long adminId = currentUserResolver.getCurrentUserId();
        KycDocument doc = findDoc(docId);
        doc.setVerificationStatus(VerificationStatus.APPROVED);
        doc.setReviewedAt(LocalDateTime.now());
        doc.setReviewedBy(adminId);
        doc.setRejectionReason(null);
        return kycRepo.saveAndFlush(doc);
    }

    /** Admin: reject a document with a reason */
    @Transactional
    public KycDocument reject(Long docId, KycRejectRequest req) {
        Long adminId = currentUserResolver.getCurrentUserId();
        KycDocument doc = findDoc(docId);
        doc.setVerificationStatus(VerificationStatus.REJECTED);
        doc.setRejectionReason(req.getReason());
        doc.setReviewedAt(LocalDateTime.now());
        doc.setReviewedBy(adminId);
        return kycRepo.saveAndFlush(doc);
    }

    private KycDocument findDoc(Long docId) {
        return kycRepo.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("KYC document not found: " + docId));
    }
}
