package com.liveboard.project;

import com.liveboard.exception.ForbiddenException;
import com.liveboard.task.TaskColumn;
import com.liveboard.task.TaskColumnRepository;
import com.liveboard.user.User;
import com.liveboard.user.UserDto;
import com.liveboard.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final TaskColumnRepository columnRepository;
    private final UserRepository userRepository;

    public List<ProjectDto> getProjectsForUser(User user) {
        return projectRepository.findByMemberUserId(user.getId())
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ProjectDto createProject(User owner, CreateProjectRequest req) {
        Project project = Project.builder()
            .name(req.getName())
            .description(req.getDescription())
            .color(req.getColor() != null ? req.getColor() : "#3B82F6")
            .icon(req.getIcon() != null ? req.getIcon() : "📋")
            .owner(owner)
            .build();
        projectRepository.save(project);

        // Add owner as member
        ProjectMember ownerMember = ProjectMember.builder()
            .project(project).user(owner).role(ProjectRole.OWNER).build();
        memberRepository.save(ownerMember);

        // Create default columns
        double[] positions = {1000, 2000, 3000};
        String[] names = {"To Do", "In Progress", "Done"};
        String[] colors = {"#64748B", "#3B82F6", "#10B981"};
        for (int i = 0; i < 3; i++) {
            TaskColumn col = TaskColumn.builder()
                .project(project).name(names[i]).position(positions[i]).color(colors[i]).build();
            columnRepository.save(col);
        }

        return toDto(project);
    }

    public ProjectDto getProject(Long projectId, User user) {
        Project project = findAndAuthorize(projectId, user);
        return toDto(project);
    }

    @Transactional
    public ProjectDto updateProject(Long projectId, User user, UpdateProjectRequest req) {
        Project project = findAndAuthorize(projectId, user);
        requireRole(projectId, user, ProjectRole.ADMIN);

        if (req.getName() != null) project.setName(req.getName());
        if (req.getDescription() != null) project.setDescription(req.getDescription());
        if (req.getColor() != null) project.setColor(req.getColor());
        if (req.getIcon() != null) project.setIcon(req.getIcon());
        projectRepository.save(project);
        return toDto(project);
    }

    @Transactional
    public void deleteProject(Long projectId, User user) {
        Project project = findAndAuthorize(projectId, user);
        requireRole(projectId, user, ProjectRole.OWNER);
        projectRepository.delete(project);
    }

    @Transactional
    public MemberDto inviteMember(Long projectId, User requester, String email, ProjectRole role) {
        requireRole(projectId, requester, ProjectRole.ADMIN);
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        User invitee = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        if (memberRepository.existsByProjectIdAndUserId(projectId, invitee.getId())) {
            throw new IllegalArgumentException("User is already a member");
        }
        ProjectMember member = ProjectMember.builder()
            .project(project).user(invitee).role(role).build();
        memberRepository.save(member);
        return toMemberDto(member);
    }

    @Transactional
    public void removeMember(Long projectId, Long userId, User requester) {
        requireRole(projectId, requester, ProjectRole.ADMIN);
        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, userId)
            .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        if (member.getRole() == ProjectRole.OWNER) {
            throw new ForbiddenException("Cannot remove the project owner");
        }
        memberRepository.delete(member);
    }

    public List<MemberDto> getMembers(Long projectId, User user) {
        findAndAuthorize(projectId, user);
        return memberRepository.findByProjectId(projectId).stream()
            .map(this::toMemberDto).collect(Collectors.toList());
    }

    // --- Helpers ---

    private Project findAndAuthorize(Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (!memberRepository.existsByProjectIdAndUserId(projectId, user.getId())) {
            throw new ForbiddenException("Not a member of this project");
        }
        return project;
    }

    private void requireRole(Long projectId, User user, ProjectRole minRole) {
        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, user.getId())
            .orElseThrow(() -> new ForbiddenException("Not a member of this project"));
        int userLevel = member.getRole().ordinal();
        int required = minRole.ordinal();
        if (userLevel > required) { // OWNER=0, ADMIN=1, MEMBER=2
            throw new ForbiddenException("Insufficient permissions");
        }
    }

    private ProjectDto toDto(Project project) {
        int memberCount = project.getMembers().size();
        return ProjectDto.builder()
            .id(project.getId())
            .name(project.getName())
            .description(project.getDescription())
            .color(project.getColor())
            .icon(project.getIcon())
            .ownerUsername(project.getOwner().getUsername())
            .memberCount(memberCount)
            .isArchived(project.isArchived())
            .createdAt(project.getCreatedAt())
            .updatedAt(project.getUpdatedAt())
            .build();
    }

    private MemberDto toMemberDto(ProjectMember pm) {
        return MemberDto.builder()
            .id(pm.getId())
            .userId(pm.getUser().getId())
            .username(pm.getUser().getUsername())
            .fullName(pm.getUser().getFullName())
            .email(pm.getUser().getEmail())
            .avatarUrl(pm.getUser().getAvatarUrl())
            .role(pm.getRole())
            .joinedAt(pm.getJoinedAt())
            .build();
    }
}
