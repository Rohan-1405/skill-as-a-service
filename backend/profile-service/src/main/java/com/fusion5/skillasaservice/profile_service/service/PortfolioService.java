package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.dto.request.AddPortfolioItemRequest;
import com.fusion5.skillasaservice.profile_service.dto.response.PortfolioResponse;
import com.fusion5.skillasaservice.profile_service.entity.Portfolio;
import com.fusion5.skillasaservice.profile_service.exception.BadRequestException;
import com.fusion5.skillasaservice.profile_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.FreelancerProfileRepository;
import com.fusion5.skillasaservice.profile_service.repository.PortfolioRepository;
import com.fusion5.skillasaservice.profile_service.security.CurrentUserResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final CurrentUserResolver currentUserResolver;

    @Value("${app.portfolio.max-items-per-freelancer:20}")
    private int maxItemsPerFreelancer;

    public PortfolioService(PortfolioRepository portfolioRepository,
                             FreelancerProfileRepository freelancerProfileRepository,
                             CurrentUserResolver currentUserResolver) {
        this.portfolioRepository = portfolioRepository;
        this.freelancerProfileRepository = freelancerProfileRepository;
        this.currentUserResolver = currentUserResolver;
    }

    @Transactional
    public PortfolioResponse addItem(Long pathUserId, AddPortfolioItemRequest request) {
        requireOwnership(pathUserId);

        if (!freelancerProfileRepository.existsByUserId(pathUserId)) {
            throw new ResourceNotFoundException("Freelancer profile not found for user " + pathUserId);
        }

        long currentCount = portfolioRepository.countByUserId(pathUserId);
        if (currentCount >= maxItemsPerFreelancer) {
            throw new BadRequestException("Maximum of " + maxItemsPerFreelancer + " portfolio items reached");
        }

        Portfolio item = new Portfolio();
        item.setUserId(pathUserId);
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setImageUrl(request.getImageUrl());
        item.setProjectUrl(request.getProjectUrl());

        return toResponse(portfolioRepository.save(item));
    }

    public List<PortfolioResponse> listItems(Long pathUserId) {
        return portfolioRepository.findByUserId(pathUserId).stream()
                .map(this::toResponse)
                .toList();
    }

    private void requireOwnership(Long pathUserId) {
        Long currentUserId = currentUserResolver.getCurrentUserId();
        if (!currentUserId.equals(pathUserId)) {
            throw new ForbiddenException("You can only modify your own portfolio");
        }
    }

    private PortfolioResponse toResponse(Portfolio item) {
        return PortfolioResponse.builder()
                .id(item.getId())
                .userId(item.getUserId())
                .title(item.getTitle())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .projectUrl(item.getProjectUrl())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
