package com.liveboard.task;

import lombok.Builder;
import lombok.Data;
import com.liveboard.user.UserDto;

import java.time.LocalDateTime;

@Data @Builder
public class CommentDto {
    private Long id;
    private Long taskId;
    private UserDto author;
    private String content;
    private boolean isEdited;
    private LocalDateTime createdAt;
}
