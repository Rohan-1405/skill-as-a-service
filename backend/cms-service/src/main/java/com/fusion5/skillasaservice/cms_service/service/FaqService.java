package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateFaqRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdateFaqRequest;
import com.fusion5.skillasaservice.cms_service.entity.Faq;
import com.fusion5.skillasaservice.cms_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.cms_service.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;

    public List<Faq> listActive() {
        return faqRepository.findByActiveTrueOrderBySortOrderAsc();
    }

    @Transactional
    public Faq create(CreateFaqRequest req) {
        Faq faq = new Faq();
        faq.setQuestion(req.getQuestion());
        faq.setAnswer(req.getAnswer());
        faq.setCategory(req.getCategory());
        faq.setSortOrder(req.getSortOrder() == null ? 0 : req.getSortOrder());
        return faqRepository.saveAndFlush(faq);
    }

    @Transactional
    public Faq update(Long id, UpdateFaqRequest req) {
        Faq faq = find(id);
        if (req.getQuestion() != null) faq.setQuestion(req.getQuestion());
        if (req.getAnswer() != null) faq.setAnswer(req.getAnswer());
        if (req.getCategory() != null) faq.setCategory(req.getCategory());
        if (req.getSortOrder() != null) faq.setSortOrder(req.getSortOrder());
        if (req.getActive() != null) faq.setActive(req.getActive());
        return faqRepository.saveAndFlush(faq);
    }

    @Transactional
    public void delete(Long id) {
        faqRepository.delete(find(id));
    }

    private Faq find(Long id) {
        return faqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found: " + id));
    }
}
