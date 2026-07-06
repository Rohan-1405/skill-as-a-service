package com.fusion5.skillasaservice.user_service.service;

import com.fusion5.skillasaservice.user_service.dto.request.AssignRolesRequest;
import com.fusion5.skillasaservice.user_service.dto.request.UpdatePermissionsRequest;
import com.fusion5.skillasaservice.user_service.dto.request.UpdateUserRequest;
import com.fusion5.skillasaservice.user_service.dto.response.PagedUserResponse;
import com.fusion5.skillasaservice.user_service.dto.response.UserResponse;
import com.fusion5.skillasaservice.user_service.entity.Permission;
import com.fusion5.skillasaservice.user_service.entity.Role;
import com.fusion5.skillasaservice.user_service.entity.User;
import com.fusion5.skillasaservice.user_service.exception.BadRequestException;
import com.fusion5.skillasaservice.user_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.user_service.repository.PermissionRepository;
import com.fusion5.skillasaservice.user_service.repository.RoleRepository;
import com.fusion5.skillasaservice.user_service.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public PagedUserResponse listUsers(int page, int size, String search, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result;

        if (StringUtils.hasText(search)) {
            result = userRepository
                    .findByEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            search, search, search, pageable);
        } else if (StringUtils.hasText(status)) {
            User.UserStatus statusEnum;
            try {
                statusEnum = User.UserStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status value: " + status);
            }
            result = userRepository.findByStatus(statusEnum, pageable);
        } else {
            result = userRepository.findAll(pageable);
        }

        return PagedUserResponse.builder()
                .users(result.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    public UserResponse getUserById(Long id) {
        User user = findUserOrThrow(id);
        return toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = findUserOrThrow(id);

        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getFirstName())) {
            user.setFirstName(request.getFirstName());
        }
        if (StringUtils.hasText(request.getLastName())) {
            user.setLastName(request.getLastName());
        }
        if (request.getMobile() != null) {
            user.setMobile(request.getMobile());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        if (StringUtils.hasText(request.getStatus())) {
            try {
                user.setStatus(User.UserStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status value: " + request.getStatus());
            }
        }

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Transactional
    public void softDeleteUser(Long id) {
        User user = findUserOrThrow(id);
        user.setStatus(User.UserStatus.BLOCKED);
        userRepository.save(user);
    }

    @Transactional
    public UserResponse assignRoles(Long id, AssignRolesRequest request) {
        User user = findUserOrThrow(id);

        Set<Role> newRoles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            Role role = roleRepository.findByRoleName(roleName.toUpperCase())
                    .orElseThrow(() -> new BadRequestException("Invalid role: " + roleName));
            newRoles.add(role);
        }

        // Replace semantics: fully replaces the user's existing role set
        user.setRoles(newRoles);
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public java.util.List<String> listAllPermissionTags() {
        return permissionRepository.findAll().stream()
                .map(Permission::getPermissionName)
                .collect(Collectors.toList());
    }

    public java.util.List<String> getUserPermissions(Long id) {
        User user = findUserOrThrow(id);
        return user.getPermissions().stream().map(Permission::getPermissionName).collect(Collectors.toList());
    }

    /** Full-replace semantics, same as assignRoles. Does not check the target user's role
     *  here — permissions are only meaningful for ADMIN accounts, but there's no harm in
     *  storing them on a non-admin account (they'd just never be checked against anything). */
    @Transactional
    public java.util.List<String> updateUserPermissions(Long id, UpdatePermissionsRequest request) {
        User user = findUserOrThrow(id);

        Set<Permission> newPermissions = new HashSet<>();
        for (String tag : request.getPermissions()) {
            Permission p = permissionRepository.findByPermissionName(tag.toUpperCase())
                    .orElseThrow(() -> new BadRequestException("Invalid permission tag: " + tag));
            newPermissions.add(p);
        }
        user.setPermissions(newPermissions);
        userRepository.save(user);
        return newPermissions.stream().map(Permission::getPermissionName).collect(Collectors.toList());
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .uuid(user.getUuid())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .profileImage(user.getProfileImage())
                .status(user.getStatus().name())
                .emailVerified(user.getEmailVerified())
                .twoFaEnabled(user.getTwoFaEnabled())
                .roles(user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
