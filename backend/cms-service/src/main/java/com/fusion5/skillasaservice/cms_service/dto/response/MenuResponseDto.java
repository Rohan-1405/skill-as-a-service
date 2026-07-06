package com.fusion5.skillasaservice.cms_service.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class MenuResponseDto {
    private Long id;
    private String menuName;
    private List<MenuItemTreeDto> items;
}
