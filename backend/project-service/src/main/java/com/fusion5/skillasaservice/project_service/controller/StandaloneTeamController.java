package com.fusion5.skillasaservice.project_service.controller;

import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.project_service.entity.Team;
import com.fusion5.skillasaservice.project_service.entity.TeamMember;
import com.fusion5.skillasaservice.project_service.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Standalone team resource — same underlying data/rules as the nested
 * /api/projects/{id}/team/** endpoints in TeamController, just addressed by teamId
 * directly. Creation is NOT duplicated here: a team always requires a projectId at
 * creation time (enforced one-team-per-project), so create via the nested endpoint;
 * everything after creation can be managed through either shape.
 */
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class StandaloneTeamController {

    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Team>>> myTeams() {
        return ResponseEntity.ok(ApiResponse.success("OK", teamService.listMyTeams()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Team>> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", teamService.getTeamById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Team>> renameTeam(@PathVariable Long id, @Valid @RequestBody UpdateTeamRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Team renamed", teamService.renameTeamById(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeamById(id);
        return ResponseEntity.ok(ApiResponse.success("Team deleted", null));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ApiResponse<TeamMember>> inviteMember(@PathVariable Long id, @Valid @RequestBody InviteMemberRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Invite sent", teamService.inviteMemberByTeamId(id, req)));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable Long id, @PathVariable Long userId) {
        teamService.removeMemberByUserId(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Member removed", null));
    }

    @PutMapping("/{id}/members/{userId}/role")
    public ResponseEntity<ApiResponse<TeamMember>> updateRole(@PathVariable Long id, @PathVariable Long userId, @Valid @RequestBody UpdateMemberRoleRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Role updated", teamService.updateRoleByUserId(id, userId, req)));
    }
}
