package com.fusion5.skillasaservice.cms_service.repository;
import com.fusion5.skillasaservice.cms_service.entity.BlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface BlogCategoryRepository extends JpaRepository<BlogCategory, Long> {
    Optional<BlogCategory> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
