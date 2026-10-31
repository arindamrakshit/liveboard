package com.liveboard.task;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class BoardDto {
    private Long projectId;
    private List<ColumnDto> columns;
}
