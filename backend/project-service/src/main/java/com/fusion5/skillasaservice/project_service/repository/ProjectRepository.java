package com.fusion5.skillasaservice.project_service.repository;
import com.fusion5.skillasaservice.project_service.entity.Project;
import com.fusion5.skillasaservice.project_service.entity.Project.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByClientId(Long clientId, Pageable pageable);
    Page<Project> findByFreelancerId(Long freelancerId, Pageable pageable);
    Page<Project> findByClientIdOrFreelancerId(Long clientId, Long freelancerId, Pageable pageable);
}
