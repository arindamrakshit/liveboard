package com.liveboard.task;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.liveboard.user.User;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // Board
    @GetMapping("/projects/{projectId}/board")
    public BoardDto getBoard(@PathVariable Long projectId, @AuthenticationPrincipal User user) {
        return taskService.getBoard(projectId, user);
    }

    // Columns
    @PostMapping("/projects/{projectId}/columns")
    @ResponseStatus(HttpStatus.CREATED)
    public ColumnDto createColumn(@PathVariable Long projectId,
                                  @RequestBody Map<String, String> body,
                                  @AuthenticationPrincipal User user) {
        return taskService.createColumn(projectId, body.get("name"), user);
    }

    // Tasks
    @PostMapping("/projects/{projectId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskDto createTask(@PathVariable Long projectId,
                              @Valid @RequestBody CreateTaskRequest req,
                              @AuthenticationPrincipal User user) {
        req.setColumnId(req.getColumnId());
        return taskService.createTask(projectId, req, user);
    }

    @GetMapping("/tasks/{taskId}")
    public TaskDto getTask(@PathVariable Long taskId, @AuthenticationPrincipal User user) {
        return taskService.getTask(taskId, user);
    }

    @PatchMapping("/tasks/{taskId}")
    public TaskDto updateTask(@PathVariable Long taskId,
                              @RequestBody UpdateTaskRequest req,
                              @AuthenticationPrincipal User user) {
        return taskService.updateTask(taskId, req, user);
    }

    @PostMapping("/tasks/{taskId}/move")
    public TaskDto moveTask(@PathVariable Long taskId,
                            @RequestBody MoveTaskRequest req,
                            @AuthenticationPrincipal User user) {
        return taskService.moveTask(taskId, req, user);
    }

    @DeleteMapping("/tasks/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long taskId, @AuthenticationPrincipal User user) {
        taskService.deleteTask(taskId, user);
    }

    // Comments
    @PostMapping("/tasks/{taskId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentDto addComment(@PathVariable Long taskId,
                                 @RequestBody Map<String, String> body,
                                 @AuthenticationPrincipal User user) {
        return taskService.addComment(taskId, body.get("content"), user);
    }
}
