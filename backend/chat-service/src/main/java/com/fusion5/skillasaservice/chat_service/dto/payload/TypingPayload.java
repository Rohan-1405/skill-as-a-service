package com.fusion5.skillasaservice.chat_service.dto.payload;
import lombok.Data;
@Data
public class TypingPayload {
    private Long roomId;
    private boolean typing;
}
