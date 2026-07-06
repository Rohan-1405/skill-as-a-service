package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateBlogRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdateBlogRequest;
import com.fusion5.skillasaservice.cms_service.entity.Blog;
import com.fusion5.skillasaservice.cms_service.exception.BadRequestException;
import com.fusion5.skillasaservice.cms_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.cms_service.repository.BlogRepository;
import com.fusion5.skillasaservice.cms_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final CurrentUserResolver currentUserResolver;

    /** Public listing — published only, optionally filtered by category. */
    public Page<Blog> listPublished(Long categoryId, Pageable pageable) {
        return categoryId == null
                ? blogRepository.findByStatus(Blog.BlogStatus.PUBLISHED, pageable)
                : blogRepository.findByStatusAndCategoryId(Blog.BlogStatus.PUBLISHED, categoryId, pageable);
    }

    /** Admin listing — every blog regardless of status. */
    public Page<Blog> listAllForAdmin(Pageable pageable) {
        return blogRepository.findAll(pageable);
    }

    /** Public single-blog fetch by slug. Increments the view counter — best-effort, this is
     *  the same "just a running column" pattern as freelancer_profiles.profile_views. */
    @Transactional
    public Blog getBySlugAndIncrementViews(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .filter(b -> b.getStatus() == Blog.BlogStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + slug));
        blog.setViewCount(blog.getViewCount() + 1);
        return blogRepository.saveAndFlush(blog);
    }

    @Transactional
    public Blog create(CreateBlogRequest req) {
        Long authorId = currentUserResolver.getCurrentUserId();
        String slug = uniqueSlug(slugify(req.getTitle()));

        Blog blog = new Blog();
        blog.setTitle(req.getTitle());
        blog.setSlug(slug);
        blog.setContent(req.getContent());
        blog.setExcerpt(req.getExcerpt());
        blog.setImage(req.getImage());
        blog.setCategoryId(req.getCategoryId());
        blog.setSeoTitle(req.getSeoTitle());
        blog.setSeoDescription(req.getSeoDescription());
        blog.setAuthorId(authorId);
        blog.setStatus(Blog.BlogStatus.DRAFT);
        return blogRepository.saveAndFlush(blog);
    }

    @Transactional
    public Blog update(Long id, UpdateBlogRequest req) {
        Blog blog = find(id);
        if (req.getTitle() != null) blog.setTitle(req.getTitle());
        if (req.getContent() != null) blog.setContent(req.getContent());
        if (req.getExcerpt() != null) blog.setExcerpt(req.getExcerpt());
        if (req.getImage() != null) blog.setImage(req.getImage());
        if (req.getCategoryId() != null) blog.setCategoryId(req.getCategoryId());
        if (req.getSeoTitle() != null) blog.setSeoTitle(req.getSeoTitle());
        if (req.getSeoDescription() != null) blog.setSeoDescription(req.getSeoDescription());

        if (req.getStatus() != null) {
            Blog.BlogStatus newStatus;
            try { newStatus = Blog.BlogStatus.valueOf(req.getStatus().toUpperCase()); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + req.getStatus()); }
            if (newStatus == Blog.BlogStatus.PUBLISHED && blog.getStatus() != Blog.BlogStatus.PUBLISHED) {
                blog.setPublishedAt(LocalDateTime.now());
            }
            blog.setStatus(newStatus);
        }
        return blogRepository.saveAndFlush(blog);
    }

    @Transactional
    public void delete(Long id) {
        blogRepository.delete(find(id));
    }

    private Blog find(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found: " + id));
    }

    private String slugify(String title) {
        return title.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }

    private String uniqueSlug(String base) {
        String slug = base;
        int suffix = 1;
        while (blogRepository.existsBySlug(slug)) {
            slug = base + "-" + (++suffix);
        }
        return slug;
    }
}
