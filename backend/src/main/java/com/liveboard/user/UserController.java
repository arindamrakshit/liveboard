package com.liveboard.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDto.from(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserDto> updateMe(
        @AuthenticationPrincipal User user,
        @RequestBody UpdateProfileRequest request
    ) {
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        userRepository.save(user);
        return ResponseEntity.ok(UserDto.from(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(u -> ResponseEntity.ok(UserDto.from(u)))
            .orElse(ResponseEntity.notFound().build());
    }
}
