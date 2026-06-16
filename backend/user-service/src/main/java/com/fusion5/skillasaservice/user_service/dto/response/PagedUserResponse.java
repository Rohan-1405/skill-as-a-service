package com.fusion5.skillasaservice.user_service.dto.response;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PagedUserResponse {
    private List<UserResponse> users;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
