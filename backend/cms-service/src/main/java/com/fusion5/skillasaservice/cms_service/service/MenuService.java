package com.fusion5.skillasaservice.cms_service.service;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateMenuRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.MenuItemRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdateMenuItemsRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.MenuItemTreeDto;
import com.fusion5.skillasaservice.cms_service.dto.response.MenuResponseDto;
import com.fusion5.skillasaservice.cms_service.entity.Menu;
import com.fusion5.skillasaservice.cms_service.entity.MenuItem;
import com.fusion5.skillasaservice.cms_service.exception.BadRequestException;
import com.fusion5.skillasaservice.cms_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.cms_service.repository.MenuItemRepository;
import com.fusion5.skillasaservice.cms_service.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;

    public List<Menu> listAll() {
        return menuRepository.findAll();
    }

    @Transactional
    public Menu create(CreateMenuRequest req) {
        String name = req.getMenuName().trim().toLowerCase();
        if (menuRepository.existsByMenuName(name)) {
            throw new BadRequestException("A menu named '" + name + "' already exists");
        }
        Menu menu = new Menu();
        menu.setMenuName(name);
        return menuRepository.saveAndFlush(menu);
    }

    public MenuResponseDto getWithItems(Long menuId) {
        Menu menu = find(menuId);
        List<MenuItem> flat = menuItemRepository.findByMenuIdOrderBySortOrderAsc(menuId);
        MenuResponseDto dto = new MenuResponseDto();
        dto.setId(menu.getId());
        dto.setMenuName(menu.getMenuName());
        dto.setItems(buildTree(flat, null));
        return dto;
    }

    /** Replaces every item under this menu with the given list — see UpdateMenuItemsRequest
     *  javadoc for why "replace whole tree" is the right semantics here. parentId in each
     *  request item must reference another item's position IN THIS SAME REQUEST by array
     *  index (0-based) if nesting is needed, since new items don't have ids yet — see below. */
    @Transactional
    public MenuResponseDto replaceItems(Long menuId, UpdateMenuItemsRequest req) {
        Menu menu = find(menuId);
        menuItemRepository.deleteByMenuId(menuId);

        List<MenuItem> saved = new ArrayList<>();
        List<MenuItemRequest> items = req.getItems();
        for (MenuItemRequest itemReq : items) {
            MenuItem item = new MenuItem();
            item.setMenuId(menuId);
            item.setLabel(itemReq.getLabel());
            item.setUrl(itemReq.getUrl());
            item.setSortOrder(itemReq.getSortOrder() == null ? 0 : itemReq.getSortOrder());
            // parentId here refers to an ALREADY-PERSISTED item id from a previous call, if
            // building nesting incrementally. For a same-request parent/child pair, the client
            // should call this endpoint twice: once for parents, then again for children with
            // the real parentId from this call's response. This is a known limitation — full
            // single-request tree submission would need a temp-id remapping layer not built here.
            item.setParentId(itemReq.getParentId());
            saved.add(menuItemRepository.saveAndFlush(item));
        }
        MenuResponseDto dto = new MenuResponseDto();
        dto.setId(menu.getId());
        dto.setMenuName(menu.getMenuName());
        dto.setItems(buildTree(saved, null));
        return dto;
    }

    @Transactional
    public void delete(Long menuId) {
        Menu menu = find(menuId);
        menuItemRepository.deleteByMenuId(menuId);
        menuRepository.delete(menu);
    }

    private Menu find(Long menuId) {
        return menuRepository.findById(menuId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found: " + menuId));
    }

    private List<MenuItemTreeDto> buildTree(List<MenuItem> flat, Long parentId) {
        Map<Long, List<MenuItem>> byParent = flat.stream()
                .collect(Collectors.groupingBy(i -> i.getParentId() == null ? -1L : i.getParentId()));
        return buildLevel(byParent, parentId == null ? -1L : parentId);
    }

    private List<MenuItemTreeDto> buildLevel(Map<Long, List<MenuItem>> byParent, Long key) {
        List<MenuItem> children = byParent.getOrDefault(key, List.of());
        List<MenuItemTreeDto> result = new ArrayList<>();
        for (MenuItem item : children) {
            MenuItemTreeDto dto = new MenuItemTreeDto();
            dto.setId(item.getId());
            dto.setLabel(item.getLabel());
            dto.setUrl(item.getUrl());
            dto.setSortOrder(item.getSortOrder());
            dto.setChildren(buildLevel(byParent, item.getId()));
            result.add(dto);
        }
        return result;
    }
}
