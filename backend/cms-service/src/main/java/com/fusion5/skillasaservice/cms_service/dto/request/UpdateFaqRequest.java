package com.fusion5.skillasaservice.cms_service.dto.request;
import lombok.Data;
@Data
public class UpdateFaqRequest {
    private String question;
    private String answer;
    private String category;
    private Integer sortOrder;
    private Boolean active;
}
