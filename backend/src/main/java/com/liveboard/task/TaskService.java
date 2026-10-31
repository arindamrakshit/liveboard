package com.liveboard.task;

import com.liveboard.exception.ForbiddenException;
import com.liveboard.project.ProjectMemberRepository;
import com.liveboard.user.User;
import com.liveboard.user.UserDto;
import com.liveboard.user.UserRepository;
import com.liveboard.websocket.BoardEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskColumnRepository columnRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final BoardEventPublisher boardEventPublisher;

    public BoardDto getBoard(Long projectId, User user) {
        assertMember(projectId, user);
        List<TaskColumn> columns = columnRepository.findByProjectIdOrderByPositionAsc(projectId);
        List<ColumnDto> columnDtos = columns.stream().map(this::toColumnDto).collect(Collectors.toList());
        return BoardDto.builder().projectId(projectId).columns(columnDtos).build();
    }

    @Transactional
    public TaskDto createTask(Long projectId, CreateTaskRequest req, User reporter) {
        assertMember(projectId, reporter);
        TaskColumn column = columnRepository.findById(req.getColumnId())
            .orElseThrow(() -> new IllegalArgumentException("Column not found"));

        double maxPos = taskRepository.findMaxPositionInColumn(column.getId());
        User assignee = req.getAssigneeId() != null
            ? userRepository.findById(req.getAssigneeId()).orElse(null) : null;

        Task task = Task.builder()
            .column(column)
            .project(column.getProject())
            .title(req.getTitle())
            .description(req.getDescription())
            .priority(req.getPriority() != null ? req.getPriority() : Priority.MEDIUM)
            .status(TaskStatus.TODO)
            .position(maxPos + 1000)
            .assignee(assignee)
            .reporter(reporter)
            .dueDate(req.getDueDate())
            .build();

        taskRepository.save(task);

        if (req.getLabels() != null) {
            req.getLabels().forEach(l -> {
                TaskLabel label = TaskLabel.builder().task(task).name(l.getName()).color(l.getColor()).build();
                task.getLabels().add(label);
            });
            taskRepository.save(task);
        }

        TaskDto dto = toDto(task);
        boardEventPublisher.publishTaskCreated(projectId, dto);
        return dto;
    }

    @Transactional
    public TaskDto updateTask(Long taskId, UpdateTaskRequest req, User user) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        assertMember(task.getProject().getId(), user);

        if (req.getTitle() != null) task.setTitle(req.getTitle());
        if (req.getDescription() != null) task.setDescription(req.getDescription());
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        if (req.getDueDate() != null) task.setDueDate(req.getDueDate());
        if (req.getAssigneeId() != null) {
            User assignee = userRepository.findById(req.getAssigneeId()).orElse(null);
            task.setAssignee(assignee);
        }

        taskRepository.save(task);
        TaskDto dto = toDto(task);
        boardEventPublisher.publishTaskUpdated(task.getProject().getId(), dto);
        return dto;
    }

    @Transactional
    public TaskDto moveTask(Long taskId, MoveTaskRequest req, User user) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        assertMember(task.getProject().getId(), user);

        TaskColumn targetColumn = columnRepository.findById(req.getTargetColumnId())
            .orElseThrow(() -> new IllegalArgumentException("Target column not found"));

        task.setColumn(targetColumn);
        task.setPosition(req.getNewPosition());
        taskRepository.save(task);

        TaskDto dto = toDto(task);
        boardEventPublisher.publishTaskMoved(task.getProject().getId(), dto);
        return dto;
    }

    @Transactional
    public void deleteTask(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        assertMember(task.getProject().getId(), user);
        Long projectId = task.getProject().getId();
        taskRepository.delete(task);
        boardEventPublisher.publishTaskDeleted(projectId, taskId);
    }

    public TaskDto getTask(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        assertMember(task.getProject().getId(), user);
        return toDto(task);
    }

    @Transactional
    public CommentDto addComment(Long taskId, String content, User author) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        assertMember(task.getProject().getId(), author);

        TaskComment comment = TaskComment.builder()
            .task(task).author(author).content(content).build();
        task.getComments().add(comment);
        taskRepository.save(task);

        CommentDto dto = toCommentDto(comment);
        boardEventPublisher.publishCommentAdded(task.getProject().getId(), taskId, dto);
        return dto;
    }

    @Transactional
    public ColumnDto createColumn(Long projectId, String name, User user) {
        assertMember(projectId, user);
        var project = columnRepository.findByProjectIdOrderByPositionAsc(projectId)
            .stream().findFirst()
            .map(TaskColumn::getProject)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        double maxPos = columnRepository.findMaxPosition(projectId);
        TaskColumn col = TaskColumn.builder()
            .project(project).name(name).position(maxPos + 1000).build();
        columnRepository.save(col);
        return toColumnDto(col);
    }

    private void assertMember(Long projectId, User user) {
        if (!memberRepository.existsByProjectIdAndUserId(projectId, user.getId())) {
            throw new ForbiddenException("Not a member of this project");
        }
    }

    // --- Mappers ---
    public TaskDto toDto(Task task) {
        return TaskDto.builder()
            .id(task.getId())
            .columnId(task.getColumn().getId())
            .projectId(task.getProject().getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .priority(task.getPriority())
            .status(task.getStatus())
            .position(task.getPosition())
            .assignee(task.getAssignee() != null ? UserDto.from(task.getAssignee()) : null)
            .reporter(UserDto.from(task.getReporter()))
            .dueDate(task.getDueDate())
            .labels(task.getLabels().stream().map(l -> new LabelDto(l.getId(), l.getName(), l.getColor())).collect(Collectors.toList()))
            .commentCount(task.getComments().size())
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }

    private ColumnDto toColumnDto(TaskColumn col) {
        return ColumnDto.builder()
            .id(col.getId())
            .name(col.getName())
            .position(col.getPosition())
            .color(col.getColor())
            .tasks(col.getTasks().stream().filter(t -> !t.isArchived()).map(this::toDto).collect(Collectors.toList()))
            .build();
    }

    private CommentDto toCommentDto(TaskComment c) {
        return CommentDto.builder()
            .id(c.getId())
            .taskId(c.getTask().getId())
            .author(UserDto.from(c.getAuthor()))
            .content(c.getContent())
            .isEdited(c.isEdited())
            .createdAt(c.getCreatedAt())
            .build();
    }
}
