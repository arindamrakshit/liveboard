package com.liveboard.task;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTaskRequest {
    private String title;
    private String description;
    private Priority priority;
    private Long assigneeId;
    private LocalDate dueDate;
}
