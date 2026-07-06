package com.fusion5.skillasaservice.storage_service.service.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * Stores files on local disk under storage.local.base-path. This is the DEFAULT provider
 * (storage.provider=local, or unset) - it requires no AWS/Wasabi account, no API keys, and
 * works immediately for local dev and testing. Files are served back through this service's
 * own GET /api/storage/files/{fileKey} endpoint, since there's no cloud bucket to point at.
 *
 * KNOWN LIMITATION: this only works if storage-service itself stays on one machine/disk.
 * It will NOT survive a redeploy to a different container or a horizontally-scaled multi-instance
 * setup unless base-path is a shared/mounted volume. That's expected and fine for now - switching
 * storage.provider=s3 once you have real credentials removes this limitation entirely without
 * any code changes elsewhere in this service or any other service that calls it.
 */
@Component
@ConditionalOnProperty(name = "storage.provider", havingValue = "local", matchIfMissing = true)
@Slf4j
public class LocalFileSystemStorageProvider implements StorageProvider {

    @Value("${storage.local.base-path:./storage-uploads}")
    private String basePath;

    @Value("${storage.local.public-base-url:http://localhost:8091}")
    private String publicBaseUrl;

    @Override
    public UploadResult upload(MultipartFile file, String folder, String fileKey) throws IOException {
        Path dir = Paths.get(basePath, folder);
        Files.createDirectories(dir);
        Path target = dir.resolve(fileKey);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String storagePath = folder + "/" + fileKey;
        String url = publicBaseUrl + "/api/storage/files/" + fileKey;
        log.info("Stored file locally at {}", target.toAbsolutePath());
        return new UploadResult(storagePath, url);
    }

    @Override
    public PresignResult presignUpload(String folder, String fileKey, String contentType) {
        // No true bypass-the-backend upload exists for local disk storage (unlike S3's signed
        // PUT URLs) - the client still has to POST the multipart file to this service directly.
        // This returns that same upload endpoint so callers written against the "presigned URL"
        // pattern still work, just without the "skip our backend" benefit S3 gives you.
        String url = publicBaseUrl + "/api/storage/upload?folder=" + folder + "&fileKey=" + fileKey;
        return new PresignResult(url, "POST", 0,
                "Local storage has no real presigned-URL bypass - POST your multipart file to this URL directly, same as /api/storage/upload. Switch storage.provider=s3 for genuine client-to-bucket presigned uploads.");
    }

    @Override
    public void delete(String storagePath) {
        try {
            Path target = Paths.get(basePath, storagePath);
            Files.deleteIfExists(target);
        } catch (IOException e) {
            log.error("Failed to delete local file {}: {}", storagePath, e.getMessage());
        }
    }

    @Override
    public InputStream retrieve(String storagePath) throws IOException {
        Path target = Paths.get(basePath, storagePath);
        return Files.newInputStream(target);
    }
}
