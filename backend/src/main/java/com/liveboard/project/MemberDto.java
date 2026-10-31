package com.liveboard.project;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MemberDto {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String avatarUrl;
    private ProjectRole role;
    private LocalDateTime joinedAt;
}
