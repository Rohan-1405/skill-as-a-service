package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.UpdateTranslationsRequest;
import com.fusion5.skillasaservice.cms_service.entity.Translation;
import com.fusion5.skillasaservice.cms_service.repository.TranslationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TranslationService {

    private final TranslationRepository translationRepository;

    public Map<String, String> getForLanguage(String languageCode) {
        Map<String, String> result = new LinkedHashMap<>();
        translationRepository.findByLanguageCode(languageCode.toLowerCase())
                .forEach(t -> result.put(t.getTranslationKey(), t.getTranslationValue()));
        return result;
    }

    /** Merges the given key/value pairs into whatever already exists for this language —
     *  keys not present in the request are left untouched, matching the DTO's javadoc. */
    @Transactional
    public Map<String, String> bulkUpsert(String languageCode, UpdateTranslationsRequest req) {
        String code = languageCode.toLowerCase();
        req.getTranslations().forEach((key, value) -> {
            Translation t = translationRepository.findByLanguageCodeAndTranslationKey(code, key)
                    .orElseGet(Translation::new);
            t.setLanguageCode(code);
            t.setTranslationKey(key);
            t.setTranslationValue(value);
            translationRepository.save(t);
        });
        return getForLanguage(code);
    }
}
