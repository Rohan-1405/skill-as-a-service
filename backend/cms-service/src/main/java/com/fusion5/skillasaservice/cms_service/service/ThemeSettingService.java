package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.UpdateThemeSettingsRequest;
import com.fusion5.skillasaservice.cms_service.entity.ThemeSetting;
import com.fusion5.skillasaservice.cms_service.exception.BadRequestException;
import com.fusion5.skillasaservice.cms_service.repository.ThemeSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ThemeSettingService {

    private final ThemeSettingRepository themeSettingRepository;

    public ThemeSetting get() {
        return themeSettingRepository.findById(1L).orElseGet(() -> {
            ThemeSetting t = new ThemeSetting();
            t.setId(1L);
            return themeSettingRepository.saveAndFlush(t);
        });
    }

    @Transactional
    public ThemeSetting update(UpdateThemeSettingsRequest req) {
        ThemeSetting t = get();
        if (req.getPrimaryColor() != null) t.setPrimaryColor(req.getPrimaryColor());
        if (req.getSecondaryColor() != null) t.setSecondaryColor(req.getSecondaryColor());
        if (req.getLogoUrl() != null) t.setLogoUrl(req.getLogoUrl());
        if (req.getFaviconUrl() != null) t.setFaviconUrl(req.getFaviconUrl());
        if (req.getCustomCss() != null) t.setCustomCss(req.getCustomCss());
        if (req.getMode() != null) {
            try { t.setMode(ThemeSetting.ThemeMode.valueOf(req.getMode().toUpperCase())); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid mode: " + req.getMode()); }
        }
        return themeSettingRepository.saveAndFlush(t);
    }
}
