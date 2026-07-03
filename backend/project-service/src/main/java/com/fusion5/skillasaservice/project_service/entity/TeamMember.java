package com.fusion5.skillasaservice.project_service.entity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "team_members",
    uniqueConstraints = @UniqueConstraint(columnNames = {"team_id","user_id"}))
@Data
public class TeamMember {
    public enum TeamRole { OWNER, ADMIN, MEMBER }
    public enum InviteStatus { PENDING, ACCEPTED, REJECTED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "team_id", nullable = false) private Long teamId;
    @Column(name = "user_id") private Long userId;  // null until invite accepted
    @Column(nullable = false, length = 255) private String email;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 10)
    private TeamRole role = TeamRole.MEMBER;
    @Enumerated(EnumType.STRING) @Column(name = "invite_status", nullable = false, length = 10)
    private InviteStatus inviteStatus = InviteStatus.PENDING;
    @CreationTimestamp @Column(name = "invited_at", updatable = false) private LocalDateTime invitedAt;
    @Column(name = "joined_at") private LocalDateTime joinedAt;
}
