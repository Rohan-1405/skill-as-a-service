package com.fusion5.skillasaservice.storage_service.service.provider;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.Duration;

/**
 * S3-compatible storage - works for real AWS S3 as-is, and for Wasabi (or any S3-compatible
 * provider) by setting storage.s3.endpoint-override to that provider's endpoint URL.
 *
 * INACTIVE by default. To turn this on:
 *   1. storage.provider=s3
 *   2. storage.s3.bucket-name=<your bucket>
 *   3. storage.s3.region=<e.g. us-east-1 for AWS, or your Wasabi region>
 *   4. storage.s3.access-key / storage.s3.secret-key
 *   5. storage.s3.endpoint-override=<only for Wasabi, e.g. https://s3.wasabisys.com - leave
 *      blank/unset for real AWS S3>
 *
 * This was written against the real AWS SDK v2 API but has NEVER been run against a real
 * bucket in this project - there were no credentials available to test with. Read the code
 * once you have real credentials; don't assume it's battle-tested just because it compiles.
 */
@Component
@ConditionalOnProperty(name = "storage.provider", havingValue = "s3")
@Slf4j
public class S3StorageProvider implements StorageProvider {

    @Value("${storage.s3.bucket-name}")
    private String bucketName;

    @Value("${storage.s3.region}")
    private String region;

    @Value("${storage.s3.access-key}")
    private String accessKey;

    @Value("${storage.s3.secret-key}")
    private String secretKey;

    @Value("${storage.s3.endpoint-override:}")
    private String endpointOverride;

    @Value("${storage.s3.presign-expiry-minutes:15}")
    private int presignExpiryMinutes;

    private S3Client s3Client;
    private S3Presigner s3Presigner;

    @PostConstruct
    public void init() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(credentials);

        var clientBuilder = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider);
        var presignerBuilder = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider);

        if (endpointOverride != null && !endpointOverride.isBlank()) {
            clientBuilder.endpointOverride(URI.create(endpointOverride));
            presignerBuilder.endpointOverride(URI.create(endpointOverride));
        }

        this.s3Client = clientBuilder.build();
        this.s3Presigner = presignerBuilder.build();
        log.info("S3StorageProvider initialized for bucket '{}' in region '{}'{}",
                bucketName, region, endpointOverride.isBlank() ? "" : " via custom endpoint " + endpointOverride);
    }

    @Override
    public UploadResult upload(MultipartFile file, String folder, String fileKey) throws IOException {
        String key = folder + "/" + fileKey;
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();
        s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        return new UploadResult(key, buildPublicUrl(key));
    }

    @Override
    public PresignResult presignUpload(String folder, String fileKey, String contentType) {
        String key = folder + "/" + fileKey;
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(presignExpiryMinutes))
                .putObjectRequest(objectRequest)
                .build();
        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);
        return new PresignResult(
                presigned.url().toString(),
                "PUT",
                presignExpiryMinutes * 60,
                "PUT your file bytes directly to this URL with header Content-Type: " + contentType +
                        " - this uploads straight to the bucket, bypassing storage-service entirely."
        );
    }

    @Override
    public void delete(String storagePath) {
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucketName).key(storagePath).build());
    }

    @Override
    public InputStream retrieve(String storagePath) throws IOException {
        return s3Client.getObject(GetObjectRequest.builder().bucket(bucketName).key(storagePath).build());
    }

    private String buildPublicUrl(String key) {
        if (endpointOverride != null && !endpointOverride.isBlank()) {
            return endpointOverride.replaceAll("/$", "") + "/" + bucketName + "/" + key;
        }
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }
}
