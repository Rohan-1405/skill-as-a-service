package com.fusion5.skillasaservice.chat_service.dto.payload;
import lombok.Data;
@Data
public class ChatMessagePayload {
    private Long roomId;
    private String content;
}
