package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateCategoryRequest;
import com.fusion5.skillasaservice.cms_service.entity.BlogCategory;
import com.fusion5.skillasaservice.cms_service.exception.BadRequestException;
import com.fusion5.skillasaservice.cms_service.repository.BlogCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class BlogCategoryService {

    private final BlogCategoryRepository categoryRepository;

    public List<BlogCategory> listAll() {
        return categoryRepository.findAll();
    }

    @Transactional
    public BlogCategory create(CreateCategoryRequest req) {
        String slug = slugify(req.getName());
        if (categoryRepository.existsBySlug(slug)) {
            throw new BadRequestException("A category with slug '" + slug + "' already exists");
        }
        BlogCategory c = new BlogCategory();
        c.setName(req.getName().trim());
        c.setSlug(slug);
        return categoryRepository.saveAndFlush(c);
    }

    private String slugify(String name) {
        return name.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
