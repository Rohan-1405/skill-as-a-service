package com.fusion5.skillasaservice.project_service.controller;
import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.project_service.entity.*;
import com.fusion5.skillasaservice.project_service.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/projects/{projectId}/team") @RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<ApiResponse<Team>> createTeam(@PathVariable Long projectId, @Valid @RequestBody CreateTeamRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Team created", teamService.createTeam(projectId, req)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<Team>> getTeam(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", teamService.getTeam(projectId)));
    }
    @PutMapping
    public ResponseEntity<ApiResponse<Team>> renameTeam(@PathVariable Long projectId, @Valid @RequestBody UpdateTeamRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Team renamed", teamService.renameTeam(projectId, req)));
    }
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Long projectId) {
        teamService.deleteTeam(projectId); return ResponseEntity.ok(ApiResponse.success("Team deleted", null));
    }
    @GetMapping("/members")
    public ResponseEntity<ApiResponse<List<TeamMember>>> getMembers(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", teamService.getMembers(projectId)));
    }
    @PostMapping("/members")
    public ResponseEntity<ApiResponse<TeamMember>> inviteMember(@PathVariable Long projectId, @Valid @RequestBody InviteMemberRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Invite sent", teamService.inviteMember(projectId, req)));
    }
    @PostMapping("/members/accept")
    public ResponseEntity<ApiResponse<TeamMember>> acceptInvite(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("Joined team", teamService.acceptInvite(projectId)));
    }
    @PatchMapping("/members/{memberId}/role")
    public ResponseEntity<ApiResponse<TeamMember>> updateRole(@PathVariable Long projectId, @PathVariable Long memberId, @Valid @RequestBody UpdateMemberRoleRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Role updated", teamService.updateMemberRole(projectId, memberId, req)));
    }
    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable Long projectId, @PathVariable Long memberId) {
        teamService.removeMember(projectId, memberId); return ResponseEntity.ok(ApiResponse.success("Member removed", null));
    }
}
