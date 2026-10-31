import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useBoardStore } from '@/stores/boardStore';
import type {
  Task,
  CreateTaskRequest,
  Priority,
  Comment,
} from '@/types';

// ─── Create Task ──────────────────────────────────────────────────────────────

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  const { addTask } = useBoardStore();

  return useMutation<Task, Error, CreateTaskRequest, { optimisticTask: Task }>({
    mutationFn: async (payload) => {
      const { data } = await api.post<Task>(
        `/projects/${projectId}/tasks`,
        payload
      );
      return data;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['board', projectId] });

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        title: payload.title,
        description: payload.description ?? null,
        priority: payload.priority ?? 'MEDIUM',
        status: 'TODO',
        position: payload.position ?? 9999,
        columnId: payload.columnId,
        projectId,
        assignee: null,
        labels: [],
        comments: [],
        commentCount: 0,
        dueDate: payload.dueDate ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addTask(optimisticTask);
      return { optimisticTask };
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectId] });
    },
  });
}

// ─── Update Task ──────────────────────────────────────────────────────────────

export interface UpdateTaskPayload {
  taskId: string;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();
  const { updateTask } = useBoardStore();

  return useMutation<Task, Error, UpdateTaskPayload, { previousTask?: Task }>({
    mutationFn: async ({ taskId, ...data }) => {
      const { data: updated } = await api.patch<Task>(
        `/tasks/${taskId}`,
        data
      );
      return updated;
    },
    onMutate: async ({ taskId, ...data }) => {
      await queryClient.cancelQueries({ queryKey: ['board', projectId] });

      const store = useBoardStore.getState();
      let previousTask: Task | undefined;
      for (const col of store.board?.columns ?? []) {
        const found = col.tasks.find((t) => String(t.id) === String(taskId));
        if (found) {
          previousTask = found;
          break;
        }
      }

      updateTask(taskId, data as Partial<Task>);
      return { previousTask };
    },
    onError: (_err, { taskId }, context) => {
      if (context?.previousTask) {
        updateTask(taskId, context.previousTask);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectId] });
    },
  });
}

// ─── Move Task ────────────────────────────────────────────────────────────────

export interface MoveTaskPayload {
  taskId: string;
  columnId: string;
  position: number;
}

export function useMoveTask(projectId: string) {
  const queryClient = useQueryClient();
  const { moveTask } = useBoardStore();

  return useMutation<
    Task,
    Error,
    MoveTaskPayload,
    { previousColumnId: string; previousPosition: number }
  >({
    mutationFn: async ({ taskId, columnId, position }) => {
      const { data: updated } = await api.post<Task>(
        `/tasks/${taskId}/move`,
        {
          targetColumnId: Number(columnId),
          newPosition: position,
        }
      );
      return updated;
    },
    onMutate: async ({ taskId, columnId, position }) => {
      await queryClient.cancelQueries({ queryKey: ['board', projectId] });

      const store = useBoardStore.getState();
      let previousColumnId = '';
      let previousPosition = 0;

      for (const col of store.board?.columns ?? []) {
        const found = col.tasks.find((t) => String(t.id) === String(taskId));
        if (found) {
          previousColumnId = String(col.id);
          previousPosition = found.position;
          break;
        }
      }

      moveTask(taskId, columnId, position);
      return { previousColumnId, previousPosition };
    },
    onError: (_err, { taskId }, context) => {
      if (context) {
        moveTask(taskId, context.previousColumnId, context.previousPosition);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectId] });
    },
  });
}

// ─── Delete Task ──────────────────────────────────────────────────────────────

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();
  const { deleteTask } = useBoardStore();

  return useMutation<void, Error, string>({
    mutationFn: async (taskId) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onMutate: async (taskId) => {
      deleteTask(taskId);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectId] });
    },
  });
}

// ─── Add Comment ──────────────────────────────────────────────────────────────

export function useAddComment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, { taskId: string; content: string }>({
    mutationFn: async ({ taskId, content }) => {
      const { data } = await api.post<Comment>(
        `/tasks/${taskId}/comments`,
        { content }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', projectId] });
    },
  });
}
