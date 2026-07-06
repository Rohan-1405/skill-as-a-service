package com.fusion5.skillasaservice.storage_service.service.provider;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;

/**
 * Storage backend abstraction. LocalFileSystemStorageProvider is active by default
 * (storage.provider=local) and works with zero external credentials - good for dev/testing
 * right now. S3StorageProvider is written and ready but inactive until storage.provider=s3
 * is set with real bucket/credentials (also works for Wasabi via a custom endpoint override).
 * Nothing else in this service needs to change when you switch providers later.
 */
public interface StorageProvider {

    UploadResult upload(MultipartFile file, String folder, String fileKey) throws IOException;

    PresignResult presignUpload(String folder, String fileKey, String contentType);

    void delete(String storagePath);

    /** LOCAL files must be fetched through this service's own /files/{key} endpoint.
     *  S3 files are fetched directly from their bucket URL - this service is never in that path. */
    InputStream retrieve(String storagePath) throws IOException;

    record UploadResult(String storagePath, String url) {}

    record PresignResult(String uploadUrl, String httpMethod, int expiresInSeconds, String note) {}
}
