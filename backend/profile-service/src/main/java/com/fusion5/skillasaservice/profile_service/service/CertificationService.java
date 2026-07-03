package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.dto.request.CertificationRequest;
import com.fusion5.skillasaservice.profile_service.entity.Certification;
import com.fusion5.skillasaservice.profile_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.CertificationRepository;
import com.fusion5.skillasaservice.profile_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certRepo;
    private final CurrentUserResolver     currentUserResolver;

    @Transactional
    public Certification add(Long profileUserId, CertificationRequest req) {
        requireOwnership(profileUserId);
        Certification c = new Certification();
        c.setUserId(profileUserId);
        return applyAndSave(req, c);
    }

    public List<Certification> list(Long userId) {
        return certRepo.findByUserIdOrderByIssueDateDesc(userId);
    }

    @Transactional
    public Certification update(Long profileUserId, Long certId, CertificationRequest req) {
        requireOwnership(profileUserId);
        Certification c = certRepo.findById(certId)
                .filter(cert -> cert.getUserId().equals(profileUserId))
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found"));
        return applyAndSave(req, c);
    }

    @Transactional
    public void delete(Long profileUserId, Long certId) {
        requireOwnership(profileUserId);
        Certification c = certRepo.findById(certId)
                .filter(cert -> cert.getUserId().equals(profileUserId))
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found"));
        certRepo.delete(c);
    }

    private void requireOwnership(Long profileUserId) {
        Long callerId = currentUserResolver.getCurrentUserId();
        if (!callerId.equals(profileUserId)) throw new ForbiddenException("You can only manage your own certifications");
    }

    private Certification applyAndSave(CertificationRequest req, Certification c) {
        c.setTitle(req.getTitle());
        c.setIssuer(req.getIssuer());
        if (req.getCredentialId()  != null) c.setCredentialId(req.getCredentialId());
        if (req.getIssueDate()     != null) c.setIssueDate(req.getIssueDate());
        if (req.getExpiryDate()    != null) c.setExpiryDate(req.getExpiryDate());
        if (req.getCredentialUrl() != null) c.setCredentialUrl(req.getCredentialUrl());
        return certRepo.saveAndFlush(c);
    }
}
