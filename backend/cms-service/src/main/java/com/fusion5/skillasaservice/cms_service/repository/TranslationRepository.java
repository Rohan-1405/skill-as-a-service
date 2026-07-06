package com.fusion5.skillasaservice.cms_service.repository;
import com.fusion5.skillasaservice.cms_service.entity.Translation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface TranslationRepository extends JpaRepository<Translation, Long> {
    List<Translation> findByLanguageCode(String languageCode);
    Optional<Translation> findByLanguageCodeAndTranslationKey(String languageCode, String translationKey);
}
