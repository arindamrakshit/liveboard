import { describe, it, expect } from 'vitest';
import type { Task, Priority } from '@/types';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: String(Math.random()),
  columnId: 'col-1',
  projectId: 'proj-1',
  title: 'Task',
  description: null,
  priority: 'MEDIUM',
  status: 'TODO',
  position: 1000,
  assignee: null,
  labels: [],
  comments: [],
  commentCount: 0,
  dueDate: null,
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-01T00:00:00Z',
  ...overrides,
});

const filterTasks = (tasks: Task[], query: string): Task[] => {
  if (!query) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(
    (t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
  );
};

const filterByPriority = (tasks: Task[], priority: Priority | 'ALL'): Task[] => {
  if (priority === 'ALL') return tasks;
  return tasks.filter((t) => t.priority === priority);
};

const sortByPriority = (tasks: Task[]): Task[] => {
  const order: Record<Priority, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  return [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
};

const sortByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

describe('task filtering and sorting', () => {
  const tasks = [
    makeTask({ id: '1', title: 'Fix login bug', priority: 'URGENT', dueDate: '2026-11-01' }),
    makeTask({ id: '2', title: 'Add dark mode', priority: 'LOW', dueDate: '2026-12-01' }),
    makeTask({ id: '3', title: 'Write tests', priority: 'HIGH', dueDate: '2026-10-31' }),
    makeTask({ id: '4', title: 'Deploy to prod', priority: 'MEDIUM', dueDate: null }),
  ];

  it('filterTasks returns all tasks when query is empty', () => {
    expect(filterTasks(tasks, '')).toHaveLength(4);
  });

  it('filterTasks filters by title substring', () => {
    const result = filterTasks(tasks, 'login');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filterTasks is case-insensitive', () => {
    expect(filterTasks(tasks, 'DARK')).toHaveLength(1);
  });

  it('filterByPriority returns correct tasks', () => {
    expect(filterByPriority(tasks, 'HIGH')).toHaveLength(1);
    expect(filterByPriority(tasks, 'ALL')).toHaveLength(4);
  });

  it('sortByPriority orders URGENT first', () => {
    const sorted = sortByPriority(tasks);
    expect(sorted[0].priority).toBe('URGENT');
    expect(sorted[sorted.length - 1].priority).toBe('LOW');
  });

  it('sortByDueDate puts null dates last', () => {
    const sorted = sortByDueDate(tasks);
    expect(sorted[sorted.length - 1].dueDate).toBeNull();
    expect(sorted[0].dueDate).toBe('2026-10-31');
  });
});
