package com.liveboard.task;

import lombok.Builder;
import lombok.Data;
import com.liveboard.user.UserDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class TaskDto {
    private Long id;
    private Long columnId;
    private Long projectId;
    private String title;
    private String description;
    private Priority priority;
    private TaskStatus status;
    private double position;
    private UserDto assignee;
    private UserDto reporter;
    private LocalDate dueDate;
    private List<LabelDto> labels;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
