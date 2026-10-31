// Mock backend service that runs in-memory/localStorage when Spring Boot is offline
// This guarantees instant standalone demo capability without requiring Docker or local MySQL.

export interface MockUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  timezone?: string;
}

const DEFAULT_USERS: MockUser[] = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    username: 'alice',
    email: 'alice@liveboard.dev',
    bio: 'Product Designer & Frontend Dev',
    timezone: 'UTC',
  },
  {
    id: '2',
    fullName: 'Bob Chen',
    username: 'bob',
    email: 'bob@liveboard.dev',
    bio: 'Full Stack Engineer',
    timezone: 'UTC',
  },
  {
    id: '3',
    fullName: 'Carol Martinez',
    username: 'carol',
    email: 'carol@liveboard.dev',
    bio: 'Backend Engineer',
    timezone: 'UTC',
  },
];

const DEFAULT_PROJECTS = [
  {
    id: '1',
    name: 'LiveBoard Launch',
    description: 'Building the LiveBoard SaaS platform — Q4 launch goals.',
    color: '#3B82F6',
    icon: '🚀',
    ownerId: '1',
    memberCount: 4,
    taskCount: 9,
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-31T10:00:00Z',
  },
  {
    id: '2',
    name: 'Design System',
    description: 'Unified component library and design tokens.',
    color: '#8B5CF6',
    icon: '🎨',
    ownerId: '1',
    memberCount: 2,
    taskCount: 3,
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-10-30T14:00:00Z',
  },
];

const DEFAULT_BOARDS: Record<string, any> = {
  '1': {
    id: 'board-1',
    projectId: '1',
    columns: [
      {
        id: 'col-1',
        name: 'To Do',
        position: 1000,
        color: '#64748B',
        projectId: '1',
        taskCount: 3,
        tasks: [
          {
            id: 'task-1',
            columnId: 'col-1',
            projectId: '1',
            title: 'Set up CI/CD pipeline',
            description: 'Configure GitHub Actions for automated testing and deployment.',
            priority: 'HIGH',
            status: 'TODO',
            position: 1000,
            assignee: { id: '3', fullName: 'Carol Martinez', username: 'carol' },
            labels: [{ id: 'l1', name: 'devops', color: '#64748B' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-11-15',
            createdAt: '2026-10-25T10:00:00Z',
          },
          {
            id: 'task-2',
            columnId: 'col-1',
            projectId: '1',
            title: 'Write onboarding documentation',
            description: 'Create getting started guide for new engineering team members.',
            priority: 'MEDIUM',
            status: 'TODO',
            position: 2000,
            assignee: { id: '2', fullName: 'Bob Chen', username: 'bob' },
            labels: [{ id: 'l2', name: 'docs', color: '#3B82F6' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-11-20',
            createdAt: '2026-10-26T11:00:00Z',
          },
          {
            id: 'task-3',
            columnId: 'col-1',
            projectId: '1',
            title: 'Implement email notifications',
            description: 'Add transactional emails for task assignments and mentions.',
            priority: 'MEDIUM',
            status: 'TODO',
            position: 3000,
            assignee: { id: '1', fullName: 'Alice Johnson', username: 'alice' },
            labels: [{ id: 'l3', name: 'backend', color: '#10B981' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-11-30',
            createdAt: '2026-10-27T12:00:00Z',
          },
        ],
      },
      {
        id: 'col-2',
        name: 'In Progress',
        position: 2000,
        color: '#3B82F6',
        projectId: '1',
        taskCount: 3,
        tasks: [
          {
            id: 'task-4',
            columnId: 'col-2',
            projectId: '1',
            title: 'Build Kanban board UI',
            description: 'Implement drag-and-drop Kanban board with real-time updates.',
            priority: 'URGENT',
            status: 'IN_PROGRESS',
            position: 1000,
            assignee: { id: '1', fullName: 'Alice Johnson', username: 'alice' },
            labels: [
              { id: 'l4', name: 'frontend', color: '#3B82F6' },
              { id: 'l5', name: 'real-time', color: '#8B5CF6' },
            ],
            comments: [
              {
                id: 'c1',
                content: 'Drag-and-drop mechanics with @dnd-kit are verified!',
                author: { fullName: 'Bob Chen', username: 'bob' },
                createdAt: '2026-10-31T09:30:00Z',
              },
            ],
            commentCount: 1,
            dueDate: '2026-11-05',
            createdAt: '2026-10-28T09:00:00Z',
          },
          {
            id: 'task-5',
            columnId: 'col-2',
            projectId: '1',
            title: 'Design REST API endpoints',
            description: 'Define and document all REST API endpoints for tasks and projects.',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            position: 2000,
            assignee: { id: '2', fullName: 'Bob Chen', username: 'bob' },
            labels: [{ id: 'l6', name: 'api', color: '#F59E0B' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-11-08',
            createdAt: '2026-10-28T10:00:00Z',
          },
          {
            id: 'task-6',
            columnId: 'col-2',
            projectId: '1',
            title: 'Database schema design',
            description: 'Finalize MySQL schema with proper indexes and foreign key constraints.',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            position: 3000,
            assignee: { id: '3', fullName: 'Carol Martinez', username: 'carol' },
            labels: [{ id: 'l7', name: 'database', color: '#EF4444' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-11-06',
            createdAt: '2026-10-29T11:00:00Z',
          },
        ],
      },
      {
        id: 'col-3',
        name: 'Done',
        position: 3000,
        color: '#10B981',
        projectId: '1',
        taskCount: 3,
        tasks: [
          {
            id: 'task-7',
            columnId: 'col-3',
            projectId: '1',
            title: 'Project planning and roadmap',
            description: 'Define Q4 milestones and assign DRIs.',
            priority: 'HIGH',
            status: 'DONE',
            position: 1000,
            assignee: { id: '1', fullName: 'Alice Johnson', username: 'alice' },
            labels: [{ id: 'l8', name: 'planning', color: '#64748B' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-10-15',
            createdAt: '2026-10-14T08:00:00Z',
          },
          {
            id: 'task-8',
            columnId: 'col-3',
            projectId: '1',
            title: 'Tech stack selection',
            description: 'Evaluate React, Zustand, Spring Boot, and MySQL stack.',
            priority: 'MEDIUM',
            status: 'DONE',
            position: 2000,
            assignee: { id: '2', fullName: 'Bob Chen', username: 'bob' },
            labels: [{ id: 'l9', name: 'architecture', color: '#8B5CF6' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-10-20',
            createdAt: '2026-10-19T09:00:00Z',
          },
          {
            id: 'task-9',
            columnId: 'col-3',
            projectId: '1',
            title: 'Design system foundations',
            description: 'Tokens, typography scale, spacing system, and CSS modules.',
            priority: 'HIGH',
            status: 'DONE',
            position: 3000,
            assignee: { id: '1', fullName: 'Alice Johnson', username: 'alice' },
            labels: [{ id: 'l10', name: 'design', color: '#EC4899' }],
            comments: [],
            commentCount: 0,
            dueDate: '2026-10-25',
            createdAt: '2026-10-24T10:00:00Z',
          },
        ],
      },
    ],
  },
};

function getStorage<T>(key: string, defaultVal: T): T {
  try {
    const val = localStorage.getItem(`liveboard_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`liveboard_${key}`, JSON.stringify(val));
  } catch {}
}

export const mockBackend = {
  login: async (identifier: string, _password?: string) => {
    const users = getStorage('users', DEFAULT_USERS);
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === identifier.toLowerCase() ||
        u.username.toLowerCase() === identifier.toLowerCase()
    );
    const user =
      found ||
      users[0] || {
        id: '1',
        fullName: identifier.split('@')[0],
        username: identifier.split('@')[0],
        email: identifier.includes('@') ? identifier : `${identifier}@liveboard.dev`,
      };

    return {
      accessToken: 'demo-jwt-token-' + Date.now(),
      refreshToken: 'demo-refresh-token-' + Date.now(),
      user,
    };
  },

  register: async (userData: any) => {
    const users = getStorage('users', DEFAULT_USERS);
    const newUser: MockUser = {
      id: String(Date.now()),
      fullName: userData.fullName || userData.username,
      username: userData.username,
      email: userData.email,
    };
    users.push(newUser);
    setStorage('users', users);
    return {
      accessToken: 'demo-jwt-token-' + Date.now(),
      refreshToken: 'demo-refresh-token-' + Date.now(),
      user: newUser,
    };
  },

  getProjects: async () => {
    return getStorage('projects', DEFAULT_PROJECTS);
  },

  getProject: async (id: string) => {
    const projects = getStorage('projects', DEFAULT_PROJECTS);
    return projects.find((p: any) => String(p.id) === String(id)) || projects[0];
  },

  createProject: async (data: any) => {
    const projects = getStorage('projects', DEFAULT_PROJECTS);
    const newProj = {
      id: String(Date.now()),
      name: data.name,
      description: data.description || '',
      color: data.color || '#3B82F6',
      icon: data.icon || '📋',
      ownerId: '1',
      memberCount: 1,
      taskCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.unshift(newProj);
    setStorage('projects', projects);

    // Create default board for new project
    const boards = getStorage('boards', DEFAULT_BOARDS);
    boards[newProj.id] = {
      id: `board-${newProj.id}`,
      projectId: newProj.id,
      columns: [
        { id: `col-1-${newProj.id}`, name: 'To Do', position: 1000, color: '#64748B', tasks: [], taskCount: 0 },
        { id: `col-2-${newProj.id}`, name: 'In Progress', position: 2000, color: '#3B82F6', tasks: [], taskCount: 0 },
        { id: `col-3-${newProj.id}`, name: 'Done', position: 3000, color: '#10B981', tasks: [], taskCount: 0 },
      ],
    };
    setStorage('boards', boards);
    return newProj;
  },

  getBoard: async (projectId: string) => {
    const boards = getStorage('boards', DEFAULT_BOARDS);
    if (!boards[projectId]) {
      boards[projectId] = {
        id: `board-${projectId}`,
        projectId,
        columns: [
          { id: `col-1-${projectId}`, name: 'To Do', position: 1000, color: '#64748B', tasks: [], taskCount: 0 },
          { id: `col-2-${projectId}`, name: 'In Progress', position: 2000, color: '#3B82F6', tasks: [], taskCount: 0 },
          { id: `col-3-${projectId}`, name: 'Done', position: 3000, color: '#10B981', tasks: [], taskCount: 0 },
        ],
      };
      setStorage('boards', boards);
    }
    return boards[projectId];
  },

  createTask: async (projectId: string, payload: any) => {
    const boards = getStorage('boards', DEFAULT_BOARDS);
    const board = boards[projectId] || boards['1'];
    const targetCol = board.columns.find((c: any) => String(c.id) === String(payload.columnId)) || board.columns[0];

    const newTask = {
      id: `task-${Date.now()}`,
      columnId: targetCol.id,
      projectId,
      title: payload.title,
      description: payload.description || null,
      priority: payload.priority || 'MEDIUM',
      status: 'TODO',
      position: targetCol.tasks.length > 0 ? targetCol.tasks[targetCol.tasks.length - 1].position + 1000 : 1000,
      assignee: null,
      labels: [],
      comments: [],
      commentCount: 0,
      dueDate: payload.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    targetCol.tasks.push(newTask);
    targetCol.taskCount = targetCol.tasks.length;
    setStorage('boards', boards);
    return newTask;
  },

  updateTask: async (taskId: string, updates: any) => {
    const boards = getStorage('boards', DEFAULT_BOARDS);
    for (const pId in boards) {
      for (const col of boards[pId].columns) {
        const tIndex = col.tasks.findIndex((t: any) => String(t.id) === String(taskId));
        if (tIndex !== -1) {
          col.tasks[tIndex] = { ...col.tasks[tIndex], ...updates, updatedAt: new Date().toISOString() };
          setStorage('boards', boards);
          return col.tasks[tIndex];
        }
      }
    }
    return updates;
  },

  moveTask: async (taskId: string, targetColId: string, newPosition: number) => {
    const boards = getStorage('boards', DEFAULT_BOARDS);
    let taskToMove: any = null;

    for (const pId in boards) {
      for (const col of boards[pId].columns) {
        const found = col.tasks.find((t: any) => String(t.id) === String(taskId));
        if (found) {
          taskToMove = found;
          col.tasks = col.tasks.filter((t: any) => String(t.id) !== String(taskId));
          col.taskCount = col.tasks.length;
          break;
        }
      }
      if (taskToMove) {
        const target = boards[pId].columns.find((c: any) => String(c.id) === String(targetColId));
        if (target) {
          taskToMove.columnId = targetColId;
          taskToMove.position = newPosition;
          target.tasks.push(taskToMove);
          target.tasks.sort((a: any, b: any) => a.position - b.position);
          target.taskCount = target.tasks.length;
        }
        setStorage('boards', boards);
        return taskToMove;
      }
    }
    return null;
  },

  deleteTask: async (taskId: string) => {
    const boards = getStorage('boards', DEFAULT_BOARDS);
    for (const pId in boards) {
      for (const col of boards[pId].columns) {
        col.tasks = col.tasks.filter((t: any) => String(t.id) !== String(taskId));
        col.taskCount = col.tasks.length;
      }
    }
    setStorage('boards', boards);
  },

  addComment: async (taskId: string, content: string) => {
    const boards = getStorage('boards', DEFAULT_BOARDS);
    for (const pId in boards) {
      for (const col of boards[pId].columns) {
        const task = col.tasks.find((t: any) => String(t.id) === String(taskId));
        if (task) {
          if (!task.comments) task.comments = [];
          const newComment = {
            id: `c-${Date.now()}`,
            content,
            author: { fullName: 'Alice Johnson', username: 'alice' },
            createdAt: new Date().toISOString(),
          };
          task.comments.push(newComment);
          task.commentCount = task.comments.length;
          setStorage('boards', boards);
          return newComment;
        }
      }
    }
    return null;
  },

  createColumn: async (projectId: string, name: string) => {
    const boards = getStorage('boards', DEFAULT_BOARDS);
    const board = boards[projectId] || boards['1'];
    const newCol = {
      id: `col-${Date.now()}`,
      name,
      position: (board.columns.length + 1) * 1000,
      color: '#64748B',
      tasks: [],
      taskCount: 0,
    };
    board.columns.push(newCol);
    setStorage('boards', boards);
    return newCol;
  },

  getMembers: async (_projectId: string) => {
    return [
      { id: '1', userId: '1', username: 'alice', fullName: 'Alice Johnson', email: 'alice@liveboard.dev', role: 'OWNER' },
      { id: '2', userId: '2', username: 'bob', fullName: 'Bob Chen', email: 'bob@liveboard.dev', role: 'ADMIN' },
      { id: '3', userId: '3', username: 'carol', fullName: 'Carol Martinez', email: 'carol@liveboard.dev', role: 'MEMBER' },
    ];
  },
};
