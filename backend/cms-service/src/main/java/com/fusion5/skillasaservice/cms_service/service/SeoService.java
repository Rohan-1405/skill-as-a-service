package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.UpdateSeoSettingsRequest;
import com.fusion5.skillasaservice.cms_service.entity.Blog;
import com.fusion5.skillasaservice.cms_service.entity.Page;
import com.fusion5.skillasaservice.cms_service.entity.SeoSetting;
import com.fusion5.skillasaservice.cms_service.repository.BlogRepository;
import com.fusion5.skillasaservice.cms_service.repository.PageRepository;
import com.fusion5.skillasaservice.cms_service.repository.SeoSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeoService {

    private final SeoSettingRepository seoSettingRepository;
    private final BlogRepository blogRepository;
    private final PageRepository pageRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    public SeoSetting getSettings() {
        return seoSettingRepository.findById(1L).orElseGet(() -> {
            SeoSetting s = new SeoSetting();
            s.setId(1L);
            return seoSettingRepository.saveAndFlush(s);
        });
    }

    @Transactional
    public SeoSetting updateSettings(UpdateSeoSettingsRequest req) {
        SeoSetting s = getSettings();
        if (req.getMetaTitle() != null) s.setMetaTitle(req.getMetaTitle());
        if (req.getMetaDescription() != null) s.setMetaDescription(req.getMetaDescription());
        if (req.getOgTitle() != null) s.setOgTitle(req.getOgTitle());
        if (req.getOgDescription() != null) s.setOgDescription(req.getOgDescription());
        if (req.getOgImage() != null) s.setOgImage(req.getOgImage());
        if (req.getSiteUrl() != null) s.setSiteUrl(req.getSiteUrl());
        return seoSettingRepository.saveAndFlush(s);
    }

    /** Builds sitemap.xml from every PUBLISHED blog and page, plus the homepage.
     *  siteUrl must be configured in SEO settings first — without it, entries fall back
     *  to relative-looking (and technically invalid per the sitemap spec) bare paths. */
    public String generateSitemapXml() {
        String base = getSettings().getSiteUrl();
        if (base == null || base.isBlank()) base = "";
        else base = base.replaceAll("/$", "");

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");
        xml.append("  <url><loc>").append(base).append("/</loc></url>\n");

        List<Blog> blogs = blogRepository.findByStatus(Blog.BlogStatus.PUBLISHED,
                PageRequest.of(0, 5000, Sort.by("updatedAt").descending())).getContent();
        for (Blog b : blogs) {
            xml.append("  <url><loc>").append(base).append("/blog/").append(escape(b.getSlug())).append("</loc>");
            if (b.getUpdatedAt() != null) {
                xml.append("<lastmod>").append(b.getUpdatedAt().format(DATE_FMT)).append("</lastmod>");
            }
            xml.append("</url>\n");
        }

        List<Page> pages = pageRepository.findByStatus(Page.PageStatus.PUBLISHED);
        for (Page p : pages) {
            xml.append("  <url><loc>").append(base).append("/").append(escape(p.getSlug())).append("</loc>");
            if (p.getUpdatedAt() != null) {
                xml.append("<lastmod>").append(p.getUpdatedAt().format(DATE_FMT)).append("</lastmod>");
            }
            xml.append("</url>\n");
        }

        xml.append("</urlset>\n");
        return xml.toString();
    }

    /** Simple default robots.txt — allows everything except admin API paths. */
    public String generateRobotsTxt() {
        String base = getSettings().getSiteUrl();
        StringBuilder sb = new StringBuilder();
        sb.append("User-agent: *\n");
        sb.append("Disallow: /api/admin/\n");
        sb.append("Allow: /\n");
        if (base != null && !base.isBlank()) {
            sb.append("Sitemap: ").append(base.replaceAll("/$", "")).append("/api/seo/sitemap.xml\n");
        }
        return sb.toString();
    }

    private String escape(String s) {
        return s == null ? "" : s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
