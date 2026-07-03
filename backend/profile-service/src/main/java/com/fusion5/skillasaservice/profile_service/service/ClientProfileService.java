package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.dto.request.ClientProfileRequest;
import com.fusion5.skillasaservice.profile_service.entity.ClientProfile;
import com.fusion5.skillasaservice.profile_service.exception.BadRequestException;
import com.fusion5.skillasaservice.profile_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.AuthUserRefRepository;
import com.fusion5.skillasaservice.profile_service.repository.ClientProfileRepository;
import com.fusion5.skillasaservice.profile_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientProfileService {

    private final ClientProfileRepository clientProfileRepository;
    private final CurrentUserResolver     currentUserResolver;

    @Transactional
    public ClientProfile create(ClientProfileRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        if (clientProfileRepository.existsByUserId(userId)) {
            throw new BadRequestException("Client profile already exists. Use PUT to update.");
        }
        ClientProfile profile = new ClientProfile();
        profile.setUserId(userId);
        return applyAndSave(req, profile);
    }

    public ClientProfile get(Long userId) {
        return clientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client profile not found for user id " + userId));
    }

    @Transactional
    public ClientProfile update(Long userId, ClientProfileRequest req) {
        Long callerId = currentUserResolver.getCurrentUserId();
        if (!callerId.equals(userId)) {
            throw new ForbiddenException("You can only update your own profile");
        }
        ClientProfile profile = clientProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client profile not found"));
        return applyAndSave(req, profile);
    }

    private ClientProfile applyAndSave(ClientProfileRequest req, ClientProfile p) {
        if (req.getCompanyName() != null) p.setCompanyName(req.getCompanyName());
        if (req.getCompanySize()  != null) p.setCompanySize(req.getCompanySize());
        if (req.getIndustry()     != null) p.setIndustry(req.getIndustry());
        if (req.getWebsite()      != null) p.setWebsite(req.getWebsite());
        if (req.getCountry()      != null) p.setCountry(req.getCountry());
        if (req.getCity()         != null) p.setCity(req.getCity());
        if (req.getBio()          != null) p.setBio(req.getBio());
        return clientProfileRepository.saveAndFlush(p);
    }
}
