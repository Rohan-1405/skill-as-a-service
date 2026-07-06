package com.fusion5.skillasaservice.cms_service.repository;
import com.fusion5.skillasaservice.cms_service.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface LanguageRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByCode(String code);
    boolean existsByCode(String code);
    List<Language> findByActiveTrue();
}
