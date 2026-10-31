package com.liveboard.websocket;

import com.liveboard.task.CommentDto;
import com.liveboard.task.TaskDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardEvent {
    private EventType type;
    private TaskDto task;
    private Long taskId;
    private CommentDto comment;

    public enum EventType {
        TASK_CREATED, TASK_UPDATED, TASK_MOVED, TASK_DELETED, COMMENT_ADDED, PRESENCE_UPDATE
    }
}
