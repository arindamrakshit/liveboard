package com.liveboard.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateTaskRequest {
    @NotBlank @Size(max = 255)
    private String title;
    private String description;
    private Long columnId;
    private Priority priority;
    private Long assigneeId;
    private LocalDate dueDate;
    private List<LabelDto> labels;
}
