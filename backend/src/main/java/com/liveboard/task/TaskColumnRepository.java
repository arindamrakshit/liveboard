package com.liveboard.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskColumnRepository extends JpaRepository<TaskColumn, Long> {
    List<TaskColumn> findByProjectIdOrderByPositionAsc(Long projectId);

    @Query("SELECT COALESCE(MAX(tc.position), 0) FROM TaskColumn tc WHERE tc.project.id = :projectId")
    double findMaxPosition(@Param("projectId") Long projectId);
}
