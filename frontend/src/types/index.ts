// ─── Enums ───────────────────────────────────────────────────────────────────

export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  timezone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: TaskStatus;
  position: number;
  columnId: string;
  projectId: string;
  assignee?: User | null;
  labels: Label[];
  comments: Comment[];
  commentCount: number;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  color?: string | null;
  projectId: string;
  tasks: Task[];
  taskCount: number;
}

export interface ProjectMember {
  id: string;
  user: User;
  role: ProjectRole;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  icon?: string | null;
  ownerId: string;
  members: ProjectMember[];
  memberCount: number;
  taskCount: number;
  recentActivity?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  projectId: string;
  project: Project;
  columns: Column[];
}

// ─── API Request / Response DTOs ─────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: Priority;
  assigneeId?: string;
  dueDate?: string;
  labelIds?: string[];
  columnId: string;
  position?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  assigneeId?: string | null;
  dueDate?: string | null;
  labelIds?: string[];
  status?: TaskStatus;
}

export interface MoveTaskRequest {
  columnId: string;
  position: number;
}

export interface AddCommentRequest {
  content: string;
}

export interface InviteMemberRequest {
  email: string;
  role: ProjectRole;
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  timezone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ─── WebSocket Event Types ────────────────────────────────────────────────────

export type WsEventType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_MOVED'
  | 'TASK_DELETED'
  | 'COLUMN_CREATED'
  | 'COLUMN_UPDATED'
  | 'COLUMN_DELETED'
  | 'MEMBER_JOINED'
  | 'MEMBER_LEFT';

export interface WsEvent<T = unknown> {
  type: WsEventType;
  payload: T;
  projectId: string;
  actorId: string;
  timestamp: string;
}

// ─── Offline Queue ────────────────────────────────────────────────────────────

export type OfflineOpType =
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'MOVE_TASK'
  | 'DELETE_TASK'
  | 'ADD_COMMENT';

export interface OfflineOp {
  id: string;
  type: OfflineOpType;
  payload: unknown;
  createdAt: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalTasks: number;
  inProgress: number;
  done: number;
  overdue: number;
}
