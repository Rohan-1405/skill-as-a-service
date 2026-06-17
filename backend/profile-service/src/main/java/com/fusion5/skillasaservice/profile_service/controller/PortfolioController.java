package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.dto.request.AddPortfolioItemRequest;
import com.fusion5.skillasaservice.profile_service.dto.response.PortfolioResponse;
import com.fusion5.skillasaservice.profile_service.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile/freelancer/{id}/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // US-PROF-03 - owner-only, enforces max 20 items
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PortfolioResponse addItem(@PathVariable Long id, @Valid @RequestBody AddPortfolioItemRequest request) {
        return portfolioService.addItem(id, request);
    }

    // Convenience listing endpoint (not in the original story, needed to verify the above)
    @GetMapping
    public List<PortfolioResponse> listItems(@PathVariable Long id) {
        return portfolioService.listItems(id);
    }
}
