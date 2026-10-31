/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore, type Task, type Column, type Board } from '@/stores/boardStore';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  columnId: 'col-10',
  projectId: 'proj-100',
  title: 'Test Task',
  description: null,
  priority: 'MEDIUM',
  status: 'TODO',
  position: 1000,
  assignee: null,
  labels: [],
  comments: [],
  commentCount: 0,
  dueDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const makeColumn = (overrides: Partial<Column> = {}): Column => ({
  id: 'col-10',
  name: 'To Do',
  position: 1000,
  color: '#64748B',
  projectId: 'proj-100',
  tasks: [],
  taskCount: 0,
  ...overrides,
});

const makeBoard = (): Board => ({
  id: 'board-1',
  projectId: 'proj-100',
  project: {
    id: 'proj-100',
    name: 'Demo Project',
    color: '#3B82F6',
    ownerId: 'u-1',
    members: [],
    memberCount: 1,
    taskCount: 2,
    createdAt: '',
    updatedAt: '',
  },
  columns: [
    makeColumn({
      id: 'col-10',
      name: 'To Do',
      tasks: [makeTask({ id: 'task-1', position: 1000 }), makeTask({ id: 'task-2', position: 2000 })],
      taskCount: 2,
    }),
    makeColumn({ id: 'col-20', name: 'In Progress', tasks: [], taskCount: 0 }),
  ],
});

describe('boardStore', () => {
  beforeEach(() => {
    useBoardStore.setState({ board: null, isLoading: false });
  });

  it('setBoard stores the board', () => {
    const board = makeBoard();
    useBoardStore.getState().setBoard(board);
    expect(useBoardStore.getState().board).toEqual(board);
  });

  it('addTask appends a task to the correct column', () => {
    useBoardStore.getState().setBoard(makeBoard());
    const newTask = makeTask({ id: 'task-3', columnId: 'col-20', position: 3000 });
    useBoardStore.getState().addTask(newTask);
    const col = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-20');
    expect(col!.tasks).toHaveLength(1);
    expect(col!.tasks[0].id).toBe('task-3');
  });

  it('updateTask replaces the task in its column', () => {
    useBoardStore.getState().setBoard(makeBoard());
    useBoardStore.getState().updateTask('task-1', { title: 'Updated Title' });
    const col = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-10');
    expect(col!.tasks.find((t) => t.id === 'task-1')!.title).toBe('Updated Title');
  });

  it('deleteTask removes task from column', () => {
    useBoardStore.getState().setBoard(makeBoard());
    useBoardStore.getState().deleteTask('task-1');
    const col = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-10');
    expect(col!.tasks.map((t) => t.id)).not.toContain('task-1');
  });

  it('moveTask moves task to target column and sorts by position', () => {
    useBoardStore.getState().setBoard(makeBoard());
    useBoardStore.getState().moveTask('task-1', 'col-20', 500);

    const fromCol = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-10');
    const toCol = useBoardStore.getState().board!.columns.find((c) => c.id === 'col-20');
    expect(fromCol!.tasks.map((t) => t.id)).not.toContain('task-1');
    expect(toCol!.tasks.map((t) => t.id)).toContain('task-1');
  });
});
