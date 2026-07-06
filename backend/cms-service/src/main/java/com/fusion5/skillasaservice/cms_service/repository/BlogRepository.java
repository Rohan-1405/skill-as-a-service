package com.fusion5.skillasaservice.cms_service.repository;
import com.fusion5.skillasaservice.cms_service.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findBySlug(String slug);
    boolean existsBySlug(String slug);
    Page<Blog> findByStatus(Blog.BlogStatus status, Pageable pageable);
    Page<Blog> findByStatusAndCategoryId(Blog.BlogStatus status, Long categoryId, Pageable pageable);
}
