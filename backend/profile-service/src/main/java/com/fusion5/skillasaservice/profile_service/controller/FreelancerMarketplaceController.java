package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.entity.FreelancerProfile;
import com.fusion5.skillasaservice.profile_service.service.FreelancerSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/profile/freelancers")
@RequiredArgsConstructor
public class FreelancerMarketplaceController {

    private final FreelancerSearchService freelancerSearchService;

    /**
     * GET /api/profile/freelancers  — Public, no JWT required.
     *
     * Query params (all optional):
     *   search       — text search in headline/bio
     *   country      — exact country filter
     *   availability — AVAILABLE | BUSY | UNAVAILABLE
     *   minRate      — minimum hourly rate
     *   maxRate      — maximum hourly rate
     *   page         — default 0
     *   size         — default 12
     *   sort         — default profileViews (DESC)
     *
     * Example: GET /api/profile/freelancers?search=java&country=India&page=0&size=12
     */
    @GetMapping
    public Page<FreelancerProfile> search(
            @RequestParam(required = false) String     search,
            @RequestParam(required = false) String     country,
            @RequestParam(required = false) String     availability,
            @RequestParam(required = false) BigDecimal minRate,
            @RequestParam(required = false) BigDecimal maxRate,
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "12") int    size,
            @RequestParam(defaultValue = "profileViews") String sort) {

        return freelancerSearchService.search(
                search, country, availability, minRate, maxRate,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sort))
        );
    }
}
