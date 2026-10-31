import { create } from 'zustand';
import type { Board, Column, Task, Priority, TaskStatus } from '@/types';

export type { Board, Column, Task, Priority, TaskStatus };

interface BoardState {
  board: Board | null;
  isLoading: boolean;
  setBoard: (board: Board) => void;
  setLoading: (loading: boolean) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string | number, updates: Partial<Task> | Task) => void;
  moveTask: (taskId: string | number, targetColumnId: string | number, newPosition: number) => void;
  deleteTask: (taskId: string | number) => void;
  addColumn: (column: Column) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: null,
  isLoading: false,

  setBoard: (board) => set({ board }),
  setLoading: (isLoading) => set({ isLoading }),

  addTask: (task) =>
    set((state) => {
      if (!state.board) return state;
      const columns = state.board.columns.map((col) =>
        String(col.id) === String(task.columnId)
          ? {
              ...col,
              tasks: [...col.tasks.filter((t) => String(t.id) !== String(task.id)), task].sort(
                (a, b) => a.position - b.position
              ),
              taskCount: (col.taskCount || col.tasks.length) + 1,
            }
          : col
      );
      return { board: { ...state.board, columns } };
    }),

  updateTask: (taskId, updates) =>
    set((state) => {
      if (!state.board) return state;
      const targetId = typeof taskId === 'object' && taskId !== null ? (taskId as any).id : taskId;
      const patch = typeof taskId === 'object' && taskId !== null ? (taskId as any) : updates;

      const columns = state.board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          String(t.id) === String(targetId) ? { ...t, ...patch } : t
        ),
      }));
      return { board: { ...state.board, columns } };
    }),

  moveTask: (taskId, targetColumnId, newPosition) =>
    set((state) => {
      if (!state.board) return state;
      let movingTask: Task | undefined;

      state.board.columns.forEach((col) => {
        const found = col.tasks.find((t) => String(t.id) === String(taskId));
        if (found) {
          movingTask = { ...found, columnId: String(targetColumnId), position: newPosition };
        }
      });

      if (!movingTask) return state;

      const columns = state.board.columns.map((col) => {
        if (String(col.id) === String(targetColumnId)) {
          const others = col.tasks.filter((t) => String(t.id) !== String(taskId));
          const updated = [...others, movingTask!].sort((a, b) => a.position - b.position);
          return { ...col, tasks: updated, taskCount: updated.length };
        }
        const filtered = col.tasks.filter((t) => String(t.id) !== String(taskId));
        return { ...col, tasks: filtered, taskCount: filtered.length };
      });

      return { board: { ...state.board, columns } };
    }),

  deleteTask: (taskId) =>
    set((state) => {
      if (!state.board) return state;
      const columns = state.board.columns.map((col) => {
        const remaining = col.tasks.filter((t) => String(t.id) !== String(taskId));
        return { ...col, tasks: remaining, taskCount: remaining.length };
      });
      return { board: { ...state.board, columns } };
    }),

  addColumn: (column) =>
    set((state) => {
      if (!state.board) return state;
      return { board: { ...state.board, columns: [...state.board.columns, column] } };
    }),
}));
