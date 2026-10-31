package com.liveboard.task;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class ColumnDto {
    private Long id;
    private String name;
    private double position;
    private String color;
    private List<TaskDto> tasks;
}
