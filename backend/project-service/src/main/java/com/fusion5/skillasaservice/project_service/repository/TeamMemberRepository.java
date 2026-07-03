package com.fusion5.skillasaservice.project_service.repository;
import com.fusion5.skillasaservice.project_service.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeamId(Long teamId);
    Optional<TeamMember> findByTeamIdAndEmail(Long teamId, String email);
    Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
    List<TeamMember> findByUserId(Long userId);
    List<TeamMember> findByEmail(String email);
}
