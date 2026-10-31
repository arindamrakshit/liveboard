package com.liveboard.project;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private String color;
    private String icon;
    private String ownerUsername;
    private int memberCount;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
