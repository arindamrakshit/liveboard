package com.liveboard.project;

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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectDto> getProjects(@AuthenticationPrincipal User user) {
        return projectService.getProjectsForUser(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto createProject(@AuthenticationPrincipal User user,
                                    @Valid @RequestBody CreateProjectRequest req) {
        return projectService.createProject(user, req);
    }

    @GetMapping("/{id}")
    public ProjectDto getProject(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return projectService.getProject(id, user);
    }

    @PatchMapping("/{id}")
    public ProjectDto updateProject(@PathVariable Long id,
                                    @AuthenticationPrincipal User user,
                                    @RequestBody UpdateProjectRequest req) {
        return projectService.updateProject(id, user, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id, @AuthenticationPrincipal User user) {
        projectService.deleteProject(id, user);
    }

    @GetMapping("/{id}/members")
    public List<MemberDto> getMembers(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return projectService.getMembers(id, user);
    }

    @PostMapping("/{id}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberDto inviteMember(@PathVariable Long id,
                                  @AuthenticationPrincipal User user,
                                  @RequestBody Map<String, String> body) {
        String email = body.get("email");
        String roleStr = body.getOrDefault("role", "MEMBER");
        ProjectRole role = ProjectRole.valueOf(roleStr.toUpperCase());
        return projectService.inviteMember(id, user, email, role);
    }

    @DeleteMapping("/{id}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(@PathVariable Long id, @PathVariable Long userId,
                             @AuthenticationPrincipal User user) {
        projectService.removeMember(id, userId, user);
    }
}
