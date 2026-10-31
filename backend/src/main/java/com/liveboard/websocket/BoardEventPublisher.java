package com.liveboard.websocket;

import com.liveboard.task.CommentDto;
import com.liveboard.task.TaskDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    private static final String BOARD_TOPIC = "/topic/projects/%d/board";

    public void publishTaskCreated(Long projectId, TaskDto task) {
        publish(projectId, BoardEvent.builder()
            .type(BoardEvent.EventType.TASK_CREATED).task(task).build());
    }

    public void publishTaskUpdated(Long projectId, TaskDto task) {
        publish(projectId, BoardEvent.builder()
            .type(BoardEvent.EventType.TASK_UPDATED).task(task).build());
    }

    public void publishTaskMoved(Long projectId, TaskDto task) {
        publish(projectId, BoardEvent.builder()
            .type(BoardEvent.EventType.TASK_MOVED).task(task).build());
    }

    public void publishTaskDeleted(Long projectId, Long taskId) {
        publish(projectId, BoardEvent.builder()
            .type(BoardEvent.EventType.TASK_DELETED).taskId(taskId).build());
    }

    public void publishCommentAdded(Long projectId, Long taskId, CommentDto comment) {
        publish(projectId, BoardEvent.builder()
            .type(BoardEvent.EventType.COMMENT_ADDED).taskId(taskId).comment(comment).build());
    }

    private void publish(Long projectId, BoardEvent event) {
        String destination = String.format(BOARD_TOPIC, projectId);
        messagingTemplate.convertAndSend(destination, event);
    }
}
