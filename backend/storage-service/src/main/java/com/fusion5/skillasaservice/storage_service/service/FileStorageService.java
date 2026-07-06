package com.fusion5.skillasaservice.storage_service.service;

import com.fusion5.skillasaservice.storage_service.dto.response.FileUploadResponseDto;
import com.fusion5.skillasaservice.storage_service.dto.response.PresignedUrlResponseDto;
import com.fusion5.skillasaservice.storage_service.entity.FileMetadata;
import com.fusion5.skillasaservice.storage_service.exception.BadRequestException;
import com.fusion5.skillasaservice.storage_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.storage_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.storage_service.repository.FileMetadataRepository;
import com.fusion5.skillasaservice.storage_service.security.CurrentUserResolver;
import com.fusion5.skillasaservice.storage_service.service.provider.StorageProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    private static final Set<String> ALLOWED_FOLDERS = Set.of(
            "profile-images", "kyc-documents", "chat-attachments", "project-attachments", "portfolio"
    );
    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024; // 10MB

    private final StorageProvider storageProvider;
    private final FileMetadataRepository fileMetadataRepository;
    private final CurrentUserResolver currentUserResolver;

    @Value("${storage.provider:local}")
    private String activeProviderName;

    /**
     * @param preAllocatedFileKey pass the fileKey a prior presignUpload() call returned, so the
     *                            file ends up under the exact key/URL the client was already told
     *                            about. Pass null for a normal direct upload (generates a new key).
     */
    @Transactional
    public FileUploadResponseDto upload(MultipartFile file, String folder, String preAllocatedFileKey) {
        validateFolder(folder);
        validateFile(file);

        String fileKey = (preAllocatedFileKey != null && !preAllocatedFileKey.isBlank())
                ? preAllocatedFileKey
                : UUID.randomUUID() + extensionOf(file.getOriginalFilename());

        try {
            StorageProvider.UploadResult result = storageProvider.upload(file, folder, fileKey);

            FileMetadata meta = new FileMetadata();
            meta.setFileKey(fileKey);
            meta.setOriginalFileName(file.getOriginalFilename());
            meta.setContentType(file.getContentType());
            meta.setSizeBytes(file.getSize());
            meta.setFolder(folder);
            meta.setUploadedBy(currentUserResolver.getCurrentUserId());
            meta.setProvider("s3".equalsIgnoreCase(activeProviderName)
                    ? FileMetadata.Provider.S3 : FileMetadata.Provider.LOCAL);
            meta.setStoragePath(result.storagePath());
            meta.setUrl(result.url());
            fileMetadataRepository.save(meta);

            return FileUploadResponseDto.builder()
                    .fileKey(fileKey).url(result.url())
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .sizeBytes(file.getSize())
                    .build();
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    /**
     * NOTE on the S3 path: a presigned PUT goes straight from the client to the bucket -
     * this service is never called again afterward, so no FileMetadata row gets created for
     * that upload. If you need every S3 presigned upload tracked in file_metadata, add a
     * confirm-upload callback the client calls after the PUT succeeds - that endpoint doesn't
     * exist yet, this is a known gap, not an oversight to be quietly ignored.
     */
    public PresignedUrlResponseDto presignUpload(String folder, String fileName, String contentType) {
        validateFolder(folder);
        String fileKey = UUID.randomUUID() + extensionOf(fileName);
        StorageProvider.PresignResult result = storageProvider.presignUpload(folder, fileKey, contentType);
        return PresignedUrlResponseDto.builder()
                .fileKey(fileKey)
                .uploadUrl(result.uploadUrl())
                .httpMethod(result.httpMethod())
                .expiresInSeconds(result.expiresInSeconds())
                .note(result.note())
                .build();
    }

    @Transactional
    public void delete(String fileKey) {
        FileMetadata meta = fileMetadataRepository.findByFileKey(fileKey)
                .orElseThrow(() -> new ResourceNotFoundException("File not found: " + fileKey));
        Long callerId = currentUserResolver.getCurrentUserId();
        if (!meta.getUploadedBy().equals(callerId) && !currentUserResolver.currentUserIsAdmin()) {
            throw new ForbiddenException("You can only delete files you uploaded");
        }
        storageProvider.delete(meta.getStoragePath());
        fileMetadataRepository.delete(meta);
    }

    /** Used by the local-serving endpoint. Only meaningful for LOCAL-provider files - S3 files
     *  are fetched directly from their bucket URL and never go through this method. */
    public FileMetadata getMetadataForServing(String fileKey) {
        return fileMetadataRepository.findByFileKey(fileKey)
                .orElseThrow(() -> new ResourceNotFoundException("File not found: " + fileKey));
    }

    public InputStream openStream(FileMetadata meta) throws IOException {
        return storageProvider.retrieve(meta.getStoragePath());
    }

    private void validateFolder(String folder) {
        if (folder == null || !ALLOWED_FOLDERS.contains(folder)) {
            throw new BadRequestException("folder must be one of: " + ALLOWED_FOLDERS);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file provided");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("File exceeds the 10MB limit");
        }
    }

    private String extensionOf(String originalFileName) {
        if (originalFileName == null) return "";
        int dot = originalFileName.lastIndexOf('.');
        return dot >= 0 ? originalFileName.substring(dot) : "";
    }
}
