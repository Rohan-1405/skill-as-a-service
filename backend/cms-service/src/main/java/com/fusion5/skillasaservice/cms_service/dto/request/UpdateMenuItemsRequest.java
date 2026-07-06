package com.fusion5.skillasaservice.cms_service.dto.request;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;
/** Replaces the ENTIRE item list for a menu — simplest correct semantics for a
 *  drag-and-drop menu builder UI that always saves the whole tree at once. */
@Data
public class UpdateMenuItemsRequest {
    @NotNull(message = "items is required (send an empty list to clear the menu)")
    @Valid
    private List<MenuItemRequest> items;
}
