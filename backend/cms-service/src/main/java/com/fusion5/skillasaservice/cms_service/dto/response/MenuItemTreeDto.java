package com.fusion5.skillasaservice.cms_service.dto.response;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class MenuItemTreeDto {
    private Long id;
    private String label;
    private String url;
    private Integer sortOrder;
    private List<MenuItemTreeDto> children = new ArrayList<>();
}
