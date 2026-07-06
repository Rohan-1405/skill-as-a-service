package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateBlogRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.CreateCategoryRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdateBlogRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.entity.Blog;
import com.fusion5.skillasaservice.cms_service.entity.BlogCategory;
import com.fusion5.skillasaservice.cms_service.service.BlogCategoryService;
import com.fusion5.skillasaservice.cms_service.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    private final BlogCategoryService categoryService;

    // ── Public ──────────────────────────────────────────────────────────────

    /** GET /api/cms/blogs?page=0&size=10&categoryId=... — published only */
    @GetMapping("/api/cms/blogs")
    public ResponseEntity<ApiResponse<Page<Blog>>> listPublished(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Blog> result = blogService.listPublished(categoryId,
                PageRequest.of(page, size, Sort.by("publishedAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    @GetMapping("/api/cms/blogs/categories")
    public ResponseEntity<ApiResponse<List<BlogCategory>>> listCategories() {
        return ResponseEntity.ok(ApiResponse.success("OK", categoryService.listAll()));
    }

    @GetMapping("/api/cms/blogs/{slug}")
    public ResponseEntity<ApiResponse<Blog>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success("OK", blogService.getBySlugAndIncrementViews(slug)));
    }

    // ── Admin ───────────────────────────────────────────────────────────────

    /** GET /api/admin/cms/blogs — every blog regardless of status (drafts included).
     *  Not in the original 17-endpoint spec, added because an admin blog list screen
     *  needs to see drafts, which the public endpoint deliberately excludes. */
    @GetMapping("/api/admin/cms/blogs")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page<Blog>>> listAllForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Blog> result = blogService.listAllForAdmin(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    @PostMapping("/api/admin/cms/blogs")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Blog>> create(@Valid @RequestBody CreateBlogRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Blog created", blogService.create(req)));
    }

    @PutMapping("/api/admin/cms/blogs/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Blog>> update(@PathVariable Long id, @Valid @RequestBody UpdateBlogRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Blog updated", blogService.update(id, req)));
    }

    @DeleteMapping("/api/admin/cms/blogs/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Blog deleted", null));
    }

    @PostMapping("/api/admin/cms/categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<BlogCategory>> createCategory(@Valid @RequestBody CreateCategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Category created", categoryService.create(req)));
    }
}
