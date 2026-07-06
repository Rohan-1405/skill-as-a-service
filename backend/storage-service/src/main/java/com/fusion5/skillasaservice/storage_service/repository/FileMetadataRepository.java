package com.fusion5.skillasaservice.storage_service.repository;

import com.fusion5.skillasaservice.storage_service.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    Optional<FileMetadata> findByFileKey(String fileKey);
}
