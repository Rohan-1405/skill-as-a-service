package com.fusion5.skillasaservice.chat_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * Generic room-creation request.
 * roomType = "PRIVATE": requires otherUserId (validates ACTIVE subscription, same as /rooms/private).
 * roomType = "GROUP":   requires name + memberUserIds (ad-hoc group, NOT tied to a project team).
 *                       Project-linked group rooms are still auto-created by the
 *                       ProjectTeamCreatedEvent listener — this endpoint is for manual groups only.
 */
@Data
public class CreateRoomRequest {

    @NotNull(message = "roomType is required (PRIVATE or GROUP)")
    private String roomType;

    // For PRIVATE
    private Long otherUserId;

    // For GROUP
    private String name;
    private List<Long> memberUserIds;

    /** Optional. If set, links this ad-hoc group room to a project (same field the
     *  auto-created team rooms use). Rejected with 400 if a room already exists for
     *  that project — one project should have exactly one group room. */
    private Long projectId;
}
