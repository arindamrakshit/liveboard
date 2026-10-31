package com.liveboard.project;

import lombok.Data;

@Data
public class UpdateProjectRequest {
    private String name;
    private String description;
    private String color;
    private String icon;
}
