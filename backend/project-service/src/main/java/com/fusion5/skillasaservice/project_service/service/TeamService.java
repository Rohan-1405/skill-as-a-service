package com.fusion5.skillasaservice.project_service.service;

import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.entity.*;
import com.fusion5.skillasaservice.project_service.entity.TeamMember.*;
import com.fusion5.skillasaservice.project_service.exception.*;
import com.fusion5.skillasaservice.project_service.messaging.*;
import com.fusion5.skillasaservice.project_service.repository.*;
import com.fusion5.skillasaservice.project_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class TeamService {

    private final TeamRepository        teamRepository;
    private final TeamMemberRepository  teamMemberRepository;
    private final AuthUserRefRepository authUserRefRepository;
    private final ProjectService        projectService;
    private final ProjectEventPublisher eventPublisher;
    private final CurrentUserResolver   currentUserResolver;

    /** Create the team for a project. Only one team per project. */
    @Transactional
    public Team createTeam(Long projectId, CreateTeamRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        Project project = projectService.find(projectId);

        // Access check: only project client or assigned freelancer can create team
        if (!project.getClientId().equals(userId) &&
            (project.getFreelancerId() == null || !project.getFreelancerId().equals(userId))) {
            throw new ForbiddenException("Only the project owner or freelancer can create a team");
        }
        if (teamRepository.existsByProjectId(projectId)) {
            throw new BadRequestException("This project already has a team");
        }

        Team team = new Team();
        team.setProjectId(projectId);
        team.setName(req.getName());
        team.setOwnerId(userId);
        Team saved = teamRepository.saveAndFlush(team);

        // Add creator as OWNER member
        TeamMember ownerMember = new TeamMember();
        ownerMember.setTeamId(saved.getId());
        ownerMember.setUserId(userId);
        ownerMember.setEmail(authUserRefRepository.findById(userId)
                .map(u -> u.getEmail()).orElse(""));
        ownerMember.setRole(TeamRole.OWNER);
        ownerMember.setInviteStatus(InviteStatus.ACCEPTED);
        ownerMember.setJoinedAt(LocalDateTime.now());
        teamMemberRepository.save(ownerMember);

        // Publish event → chat-service auto-creates group chat room
        eventPublisher.publishTeamCreated(ProjectTeamCreatedEvent.builder()
                .projectId(projectId)
                .projectName(project.getTitle())
                .teamId(saved.getId())
                .ownerId(userId)
                .memberUserIds(List.of(userId))
                .build());

        log.info("Team {} created for project {}", saved.getId(), projectId);
        return saved;
    }

    /** Rename the team. Owner only. */
    @Transactional
    public Team renameTeam(Long projectId, UpdateTeamRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeam(projectId);
        requireOwner(team, userId);
        team.setName(req.getName().trim());
        return teamRepository.saveAndFlush(team);
    }

    /** Delete the team and all its members. Owner only. Does not delete the associated chat room. */
    @Transactional
    public void deleteTeam(Long projectId) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeam(projectId);
        requireOwner(team, userId);
        teamMemberRepository.deleteAll(teamMemberRepository.findByTeamId(team.getId()));
        teamRepository.delete(team);
        log.info("Team {} deleted for project {}", team.getId(), projectId);
    }

    public Team getTeam(Long projectId) {
        return teamRepository.findByProjectId(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("No team found for project " + projectId));
    }

    public List<TeamMember> getMembers(Long projectId) {
        Team team = getTeam(projectId);
        return teamMemberRepository.findByTeamId(team.getId());
    }

    /** Invite a user by email. Registered users get a notification-service event published. */
    @Transactional
    public TeamMember inviteMember(Long projectId, InviteMemberRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeam(projectId);
        requireAdminOrOwner(team, userId);

        // Check not already invited
        if (teamMemberRepository.findByTeamIdAndEmail(team.getId(), req.getEmail()).isPresent()) {
            throw new BadRequestException("This email has already been invited to the team");
        }

        TeamRole role;
        try { role = TeamRole.valueOf(req.getRole().toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid role: " + req.getRole()); }
        if (role == TeamRole.OWNER) throw new BadRequestException("Cannot invite someone as OWNER");

        // Look up userId by email if they're a registered user
        Long invitedUserId = authUserRefRepository.findByEmail(req.getEmail())
                .map(u -> u.getId()).orElse(null);

        TeamMember member = new TeamMember();
        member.setTeamId(team.getId());
        member.setEmail(req.getEmail());
        member.setUserId(invitedUserId);
        member.setRole(role);
        member.setInviteStatus(InviteStatus.PENDING);
        TeamMember saved = teamMemberRepository.saveAndFlush(member);

        // Notify the invited user (if they're a registered user — otherwise there's
        // no userId to notify yet; they'll see the invite when they register+accept).
        if (invitedUserId != null) {
            Project project = projectService.find(projectId);
            eventPublisher.publishTeamInvite(NotificationEvent.builder()
                    .userId(invitedUserId)
                    .title("Team invitation")
                    .message("You've been invited to join the team for project \"" + project.getTitle() + "\" as " + role + ".")
                    .type("TEAM_INVITE")
                    .sendEmail(true)
                    .build());
        }
        log.info("Invited {} to team {} as {}", req.getEmail(), team.getId(), role);
        return saved;
    }

    /** Accept invite — called by the invited user (matched by their userId). */
    @Transactional
    public TeamMember acceptInvite(Long projectId) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeam(projectId);
        String email = authUserRefRepository.findById(userId)
                .map(u -> u.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TeamMember member = teamMemberRepository.findByTeamIdAndEmail(team.getId(), email)
                .orElseThrow(() -> new ResourceNotFoundException("No pending invite found for your account"));

        if (member.getInviteStatus() != InviteStatus.PENDING) {
            throw new BadRequestException("Invite is already " + member.getInviteStatus());
        }

        member.setUserId(userId);
        member.setInviteStatus(InviteStatus.ACCEPTED);
        member.setJoinedAt(LocalDateTime.now());
        TeamMember saved = teamMemberRepository.saveAndFlush(member);

        // Re-publish event with updated member list so chat-service adds them to group room
        List<Long> memberIds = teamMemberRepository.findByTeamId(team.getId()).stream()
                .filter(m -> m.getUserId() != null && m.getInviteStatus() == InviteStatus.ACCEPTED)
                .map(TeamMember::getUserId).collect(Collectors.toList());

        Project project = projectService.find(projectId);
        eventPublisher.publishTeamCreated(ProjectTeamCreatedEvent.builder()
                .projectId(projectId).projectName(project.getTitle())
                .teamId(team.getId()).ownerId(team.getOwnerId())
                .memberUserIds(memberIds).build());

        log.info("User {} accepted invite to team {}", userId, team.getId());
        return saved;
    }

    @Transactional
    public TeamMember updateMemberRole(Long projectId, Long memberId, UpdateMemberRoleRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeam(projectId);
        requireOwner(team, userId);

        TeamMember member = teamMemberRepository.findById(memberId)
                .filter(m -> m.getTeamId().equals(team.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (member.getRole() == TeamRole.OWNER) throw new BadRequestException("Cannot change OWNER role");

        TeamRole newRole;
        try { newRole = TeamRole.valueOf(req.getRole().toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid role: " + req.getRole()); }
        if (newRole == TeamRole.OWNER) throw new BadRequestException("Cannot assign OWNER role");

        member.setRole(newRole);
        return teamMemberRepository.saveAndFlush(member);
    }

    @Transactional
    public void removeMember(Long projectId, Long memberId) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeam(projectId);
        requireAdminOrOwner(team, userId);

        TeamMember member = teamMemberRepository.findById(memberId)
                .filter(m -> m.getTeamId().equals(team.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (member.getRole() == TeamRole.OWNER) throw new BadRequestException("Cannot remove the team owner");
        teamMemberRepository.delete(member);
    }

    private void requireOwner(Team team, Long userId) {
        if (!team.getOwnerId().equals(userId)) throw new ForbiddenException("Only the team owner can do this");
    }

    private void requireAdminOrOwner(Team team, Long userId) {
        TeamMember me = teamMemberRepository.findByTeamIdAndUserId(team.getId(), userId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this team"));
        if (me.getRole() == TeamRole.MEMBER) throw new ForbiddenException("Only team admin or owner can do this");
    }

    // ── Standalone /api/teams resource (mirrors the /api/projects/{id}/team/** methods
    //    above, addressed by teamId directly instead of via projectId). Creation is
    //    intentionally NOT duplicated here — a team always requires a projectId at
    //    creation time (one-team-per-project is enforced), so "POST /api/teams" with no
    //    project context doesn't fit this data model. Create via the nested endpoint,
    //    then manage via either shape afterward. ──────────────────────────────────────

    /** All teams the caller owns or is a member of. */
    public List<Team> listMyTeams() {
        Long userId = currentUserResolver.getCurrentUserId();
        List<Long> teamIds = teamMemberRepository.findByUserId(userId).stream()
                .map(TeamMember::getTeamId).distinct().collect(Collectors.toList());
        return teamRepository.findAllById(teamIds);
    }

    public Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + teamId));
    }

    @Transactional
    public Team renameTeamById(Long teamId, UpdateTeamRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeamById(teamId);
        requireOwner(team, userId);
        team.setName(req.getName().trim());
        return teamRepository.saveAndFlush(team);
    }

    @Transactional
    public void deleteTeamById(Long teamId) {
        Long userId = currentUserResolver.getCurrentUserId();
        Team team = getTeamById(teamId);
        requireOwner(team, userId);
        teamMemberRepository.deleteAll(teamMemberRepository.findByTeamId(team.getId()));
        teamRepository.delete(team);
        log.info("Team {} deleted (via standalone /api/teams)", teamId);
    }

    @Transactional
    public TeamMember inviteMemberByTeamId(Long teamId, InviteMemberRequest req) {
        return inviteMember(getTeamById(teamId).getProjectId(), req);
    }

    @Transactional
    public void removeMemberByUserId(Long teamId, Long targetUserId) {
        Long callerId = currentUserResolver.getCurrentUserId();
        Team team = getTeamById(teamId);
        requireAdminOrOwner(team, callerId);

        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("This user is not a member of this team"));
        if (member.getRole() == TeamRole.OWNER) throw new BadRequestException("Cannot remove the team owner");
        teamMemberRepository.delete(member);
    }

    @Transactional
    public TeamMember updateRoleByUserId(Long teamId, Long targetUserId, UpdateMemberRoleRequest req) {
        Long callerId = currentUserResolver.getCurrentUserId();
        Team team = getTeamById(teamId);
        requireOwner(team, callerId);

        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("This user is not a member of this team"));
        if (member.getRole() == TeamRole.OWNER) throw new BadRequestException("Cannot change OWNER role");

        TeamRole newRole;
        try { newRole = TeamRole.valueOf(req.getRole().toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid role: " + req.getRole()); }
        if (newRole == TeamRole.OWNER) throw new BadRequestException("Cannot assign OWNER role");

        member.setRole(newRole);
        return teamMemberRepository.saveAndFlush(member);
    }
}
