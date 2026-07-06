package com.fusion5.skillasaservice.storage_service.controller;

import com.fusion5.skillasaservice.storage_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.storage_service.dto.response.FileUploadResponseDto;
import com.fusion5.skillasaservice.storage_service.dto.response.PresignedUrlResponseDto;
import com.fusion5.skillasaservice.storage_service.entity.FileMetadata;
import com.fusion5.skillasaservice.storage_service.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final FileStorageService fileStorageService;

    /** POST /api/storage/upload?folder=profile-images[&fileKey=...] (multipart form field "file")
     *  fileKey is optional - only pass it if you're completing a presigned-upload flow that
     *  already reserved a key via GET /presigned-url. */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<FileUploadResponseDto> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam String folder,
            @RequestParam(required = false) String fileKey) {
        return ApiResponse.success("File uploaded", fileStorageService.upload(file, folder, fileKey));
    }

    /** GET /api/storage/presigned-url?folder=...&fileName=...&contentType=...
     *  On LOCAL storage this returns a passthrough to /upload (see LocalFileSystemStorageProvider
     *  javadoc) - it's a real bypass-the-backend URL only once storage.provider=s3. */
    @GetMapping("/presigned-url")
    public ApiResponse<PresignedUrlResponseDto> presignedUrl(
            @RequestParam String folder,
            @RequestParam String fileName,
            @RequestParam(defaultValue = "application/octet-stream") String contentType) {
        return ApiResponse.success("OK", fileStorageService.presignUpload(folder, fileName, contentType));
    }

    /** DELETE /api/storage/{fileKey} - owner or admin/super_admin only */
    @DeleteMapping("/{fileKey}")
    public ApiResponse<Void> delete(@PathVariable String fileKey) {
        fileStorageService.delete(fileKey);
        return ApiResponse.success("File deleted", null);
    }

    /** GET /api/storage/files/{fileKey} - serves LOCAL-provider files directly; for an S3-provider
     *  file this redirects to the real bucket URL instead of proxying the bytes through here. */
    @GetMapping("/files/{fileKey}")
    public ResponseEntity<?> serve(@PathVariable String fileKey) throws IOException {
        FileMetadata meta = fileStorageService.getMetadataForServing(fileKey);

        if (meta.getProvider() == FileMetadata.Provider.S3) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(meta.getUrl()))
                    .build();
        }

        InputStreamResource resource = new InputStreamResource(fileStorageService.openStream(meta));
        MediaType mediaType = meta.getContentType() != null
                ? MediaType.parseMediaType(meta.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + meta.getOriginalFileName() + "\"")
                .body(resource);
    }
}
