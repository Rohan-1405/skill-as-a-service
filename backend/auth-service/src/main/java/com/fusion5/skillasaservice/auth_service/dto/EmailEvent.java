package com.fusion5.skillasaservice.auth_service.dto;

import lombok.*;
import java.io.Serializable;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class EmailEvent implements Serializable {
    private String toEmail;
    private String subject;
    private String body;
    private EmailType type;

    public enum EmailType {
        VERIFICATION,
        WELCOME,
        PASSWORD_RESET
    }
}