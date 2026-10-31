package com.liveboard.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByColumnIdOrderByPositionAsc(Long columnId);

    List<Task> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    @Query("SELECT COALESCE(MAX(t.position), 0) FROM Task t WHERE t.column.id = :columnId")
    double findMaxPositionInColumn(@Param("columnId") Long columnId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.isArchived = false ORDER BY t.updatedAt DESC")
    List<Task> findRecentByProjectId(@Param("projectId") Long projectId);
}
