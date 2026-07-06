package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.CreatePageRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdatePageRequest;
import com.fusion5.skillasaservice.cms_service.entity.Page;
import com.fusion5.skillasaservice.cms_service.exception.BadRequestException;
import com.fusion5.skillasaservice.cms_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.cms_service.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

/**
 * NOTE: this service deliberately never imports org.springframework.data.domain.Page —
 * that would collide with this package's own Page (entity) class. Static pages are a small,
 * admin-curated set (About, Contact, Terms, ...), not a large paginated collection, so plain
 * List returns are the right fit anyway, not just a workaround.
 */
@Service
@RequiredArgsConstructor
public class PageService {

    private final PageRepository pageRepository;

    public List<Page> listPublished() {
        return pageRepository.findByStatus(Page.PageStatus.PUBLISHED);
    }

    public List<Page> listAllForAdmin() {
        return pageRepository.findAll();
    }

    public Page getBySlug(String slug) {
        return pageRepository.findBySlug(slug)
                .filter(p -> p.getStatus() == Page.PageStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
    }

    @Transactional
    public Page create(CreatePageRequest req) {
        String slug = uniqueSlug(slugify(req.getTitle()));
        Page page = new Page();
        page.setTitle(req.getTitle());
        page.setSlug(slug);
        page.setContent(req.getContent());
        page.setSeoTitle(req.getSeoTitle());
        page.setSeoDescription(req.getSeoDescription());
        page.setStatus(Page.PageStatus.DRAFT);
        return pageRepository.saveAndFlush(page);
    }

    @Transactional
    public Page update(Long id, UpdatePageRequest req) {
        Page page = find(id);
        if (req.getTitle() != null) page.setTitle(req.getTitle());
        if (req.getContent() != null) page.setContent(req.getContent());
        if (req.getSeoTitle() != null) page.setSeoTitle(req.getSeoTitle());
        if (req.getSeoDescription() != null) page.setSeoDescription(req.getSeoDescription());
        if (req.getStatus() != null) {
            try { page.setStatus(Page.PageStatus.valueOf(req.getStatus().toUpperCase())); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + req.getStatus()); }
        }
        return pageRepository.saveAndFlush(page);
    }

    @Transactional
    public void delete(Long id) {
        pageRepository.delete(find(id));
    }

    private Page find(Long id) {
        return pageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + id));
    }

    private String slugify(String title) {
        return title.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }

    private String uniqueSlug(String base) {
        String slug = base;
        int suffix = 1;
        while (pageRepository.existsBySlug(slug)) {
            slug = base + "-" + (++suffix);
        }
        return slug;
    }
}
