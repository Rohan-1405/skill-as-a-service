package com.fusion5.skillasaservice.project_service.repository;

import com.fusion5.skillasaservice.project_service.entity.ProjectAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectAttachmentRepository extends JpaRepository<ProjectAttachment, Long> {
    List<ProjectAttachment> findByProjectIdOrderByUploadedAtDesc(Long projectId);
}
