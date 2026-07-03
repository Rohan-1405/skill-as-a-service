package com.fusion5.skillasaservice.profile_service.repository;

import com.fusion5.skillasaservice.profile_service.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    List<WorkExperience> findByUserIdOrderByStartDateDesc(Long userId);
}
