package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.entity.FreelancerProfile;
import com.fusion5.skillasaservice.profile_service.repository.FreelancerProfileRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerSearchService {

    private final FreelancerProfileRepository profileRepository;

    /**
     * Marketplace search — all parameters optional.
     *
     * @param search       free-text search on headline or bio
     * @param country      exact country filter (case-insensitive)
     * @param availability AVAILABLE | BUSY | UNAVAILABLE
     * @param minRate      minimum hourly rate
     * @param maxRate      maximum hourly rate
     * @param pageable     pagination + sort (default: profileViews DESC)
     */
    public Page<FreelancerProfile> search(String search,
                                           String country,
                                           String availability,
                                           BigDecimal minRate,
                                           BigDecimal maxRate,
                                           Pageable pageable) {
        Specification<FreelancerProfile> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("headline")), like),
                        cb.like(cb.lower(root.get("bio")), like)
                ));
            }

            if (country != null && !country.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("country")), country.toLowerCase()));
            }

            if (availability != null && !availability.isBlank()) {
                predicates.add(cb.equal(
                        root.get("availabilityStatus").as(String.class),
                        availability.toUpperCase()
                ));
            }

            if (minRate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("hourlyRate"), minRate));
            }

            if (maxRate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("hourlyRate"), maxRate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return profileRepository.findAll(spec, pageable);
    }
}
