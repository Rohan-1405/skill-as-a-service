package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;
/** Bulk upsert — key/value pairs merge into whatever translations already exist for
 *  this language; existing keys not present in this map are left untouched. */
@Data
public class UpdateTranslationsRequest {
    @NotNull(message = "translations map is required")
    private Map<String, String> translations;
}
