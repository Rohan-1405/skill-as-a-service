package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateLanguageRequest;
import com.fusion5.skillasaservice.cms_service.entity.Language;
import com.fusion5.skillasaservice.cms_service.exception.BadRequestException;
import com.fusion5.skillasaservice.cms_service.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;

    public List<Language> listActive() {
        return languageRepository.findByActiveTrue();
    }

    @Transactional
    public Language create(CreateLanguageRequest req) {
        String code = req.getCode().trim().toLowerCase();
        if (languageRepository.existsByCode(code)) {
            throw new BadRequestException("Language '" + code + "' already exists");
        }
        if (req.isDefaultLanguage()) {
            // Only one default language — unset any existing one.
            languageRepository.findAll().stream()
                    .filter(Language::isDefaultLanguage)
                    .forEach(l -> { l.setDefaultLanguage(false); languageRepository.save(l); });
        }
        Language lang = new Language();
        lang.setCode(code);
        lang.setName(req.getName());
        lang.setDefaultLanguage(req.isDefaultLanguage());
        lang.setRtl(req.isRtl());
        lang.setActive(true);
        return languageRepository.saveAndFlush(lang);
    }
}
