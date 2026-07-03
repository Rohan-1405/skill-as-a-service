package com.fusion5.skillasaservice.chat_service.dto.request;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class CreatePrivateRoomRequest {
    /** The OTHER user's ID to start chat with.
     *  Chat-service will verify an ACTIVE subscription exists between caller and this user. */
    @NotNull(message = "otherUserId is required")
    private Long otherUserId;
}
