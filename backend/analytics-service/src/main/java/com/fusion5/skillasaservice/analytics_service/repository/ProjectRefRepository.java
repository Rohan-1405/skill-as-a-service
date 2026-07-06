package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.ProjectRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRefRepository extends JpaRepository<ProjectRef, Long> {

    @Query("select p.status, count(p) from ProjectRef p where p.freelancerId = :freelancerId group by p.status")
    List<Object[]> statusCountsForFreelancer(@Param("freelancerId") Long freelancerId);

    @Query("select p.status, count(p) from ProjectRef p where p.clientId = :clientId group by p.status")
    List<Object[]> statusCountsForClient(@Param("clientId") Long clientId);

    long count();
}
