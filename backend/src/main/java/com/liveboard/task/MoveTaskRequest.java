package com.liveboard.task;

import lombok.Data;

@Data
public class MoveTaskRequest {
    private Long targetColumnId;
    private double newPosition;
}
