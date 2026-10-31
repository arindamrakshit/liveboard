import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { wsManager } from '@/lib/websocket';
import { useBoardStore } from '@/stores/boardStore';
import type { Board, WsEvent, Task } from '@/types';

export function useBoard(projectId: string) {
  const { board, setBoard, addTask, updateTask, moveTask, deleteTask } =
    useBoardStore();

  const query = useQuery<Board>({
    queryKey: ['board', projectId],
    queryFn: async () => {
      const { data } = await api.get<Board>(
        `/api/projects/${projectId}/board`
      );
      return data;
    },
    enabled: Boolean(projectId),
    staleTime: 30_000,
  });

  // Sync fetched board into store
  useEffect(() => {
    if (query.data) {
      setBoard(query.data);
    }
  }, [query.data, setBoard]);

  // Subscribe to real-time WebSocket events
  useEffect(() => {
    if (!projectId) return;

    const handleEvent = (event: WsEvent) => {
      switch (event.type) {
        case 'TASK_CREATED': {
          const task = event.payload as Task;
          addTask(task);
          break;
        }
        case 'TASK_UPDATED': {
          const task = event.payload as Task;
          updateTask(task.id, task);
          break;
        }
        case 'TASK_MOVED': {
          const { taskId, columnId, position } = event.payload as {
            taskId: string;
            columnId: string;
            position: number;
          };
          moveTask(taskId, columnId, position);
          break;
        }
        case 'TASK_DELETED': {
          const { taskId } = event.payload as { taskId: string };
          deleteTask(taskId);
          break;
        }
        case 'COLUMN_CREATED':
        case 'COLUMN_UPDATED':
        case 'COLUMN_DELETED': {
          // Re-fetch the full board when columns change
          query.refetch();
          break;
        }
        default:
          break;
      }
    };

    wsManager.subscribe(projectId, handleEvent);
    return () => {
      wsManager.unsubscribe(projectId, handleEvent);
    };
  }, [projectId, addTask, updateTask, moveTask, deleteTask, query]);

  return {
    board,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
