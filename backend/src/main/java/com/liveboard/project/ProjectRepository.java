package com.liveboard.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.user.id = :userId AND p.isArchived = false ORDER BY p.updatedAt DESC")
    List<Project> findByMemberUserId(@Param("userId") Long userId);

    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.user.id = :userId")
    Optional<ProjectMember> findMembership(@Param("projectId") Long projectId, @Param("userId") Long userId);
}
