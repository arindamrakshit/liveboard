package com.liveboard.user;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserDto {
    private Long id;
    private String email;
    private String username;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private String timezone;
    private LocalDateTime createdAt;

    public static UserDto from(User user) {
        return UserDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .avatarUrl(user.getAvatarUrl())
            .bio(user.getBio())
            .timezone(user.getTimezone())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
