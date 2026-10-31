package com.liveboard.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateProjectRequest {
    @NotBlank @Size(max = 100)
    private String name;
    private String description;
    private String color;
    private String icon;
}
