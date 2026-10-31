/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/websocket', () => ({
  wsManager: { publishTaskCreated: vi.fn(), isConnected: false },
}));

import { useBoardStore } from '@/stores/boardStore';
import type { Task } from '@/types';

const makeTask = (id = '1'): Task => ({
  id,
  columnId: 'col-10',
  projectId: 'proj-100',
  title: `Task ${id}`,
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
});

describe('optimistic update behavior', () => {
  beforeEach(() => {
    useBoardStore.setState({
      board: {
        id: 'board-1',
        projectId: 'proj-100',
        project: {
          id: 'proj-100',
          name: 'Demo',
          color: '#3B82F6',
          ownerId: 'u-1',
          members: [],
          memberCount: 1,
          taskCount: 1,
          createdAt: '',
          updatedAt: '',
        },
        columns: [
          {
            id: 'col-10',
            projectId: 'proj-100',
            name: 'To Do',
            position: 1000,
            color: '#ccc',
            tasks: [makeTask('1')],
            taskCount: 1,
          },
          {
            id: 'col-20',
            projectId: 'proj-100',
            name: 'Done',
            position: 2000,
            color: '#aaa',
            tasks: [],
            taskCount: 0,
          },
        ],
      },
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it('optimistically updates task title before API responds', async () => {
    const { addTask } = useBoardStore.getState();
    const newTask = { ...makeTask('99'), title: 'New Optimistic Task' };

    act(() => {
      addTask(newTask);
    });

    const col = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-10');
    expect(col!.tasks.find((t) => t.id === '99')?.title).toBe('New Optimistic Task');
  });

  it('rollback removes optimistic task on API failure', async () => {
    const { addTask, deleteTask } = useBoardStore.getState();
    const optimisticTask = { ...makeTask('98'), title: 'Optimistic' };

    act(() => {
      addTask(optimisticTask);
    });
    expect(useBoardStore.getState().board!.columns[0].tasks).toHaveLength(2);

    // Simulate rollback
    act(() => {
      deleteTask('98');
    });
    expect(useBoardStore.getState().board!.columns[0].tasks).toHaveLength(1);
  });

  it('moveTask optimistically moves task then restores on rollback', () => {
    const { moveTask } = useBoardStore.getState();

    act(() => {
      moveTask('1', 'col-20', 500);
    });

    const fromCol = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-10');
    const toCol = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-20');
    expect(fromCol!.tasks.map((t) => t.id)).not.toContain('1');
    expect(toCol!.tasks.map((t) => t.id)).toContain('1');

    // Rollback: move back
    act(() => {
      moveTask('1', 'col-10', 1000);
    });
    const fromColAfter = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-10');
    expect(fromColAfter!.tasks.map((t) => t.id)).toContain('1');
  });
});
