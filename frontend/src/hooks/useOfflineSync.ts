import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { offlineQueue } from '@/lib/db';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useOfflineSync() {
  const { isOnline, setOnline, pendingOpsCount, setPendingOps } = useUIStore();

  // Sync pending operations to backend
  const syncPendingOperations = async () => {
    const ops = await offlineQueue.getAll();
    if (ops.length === 0) return;

    toast.loading(`Syncing ${ops.length} pending offline changes...`, { id: 'offline-sync' });

    for (const op of ops) {
      try {
        if (op.type === 'CREATE_TASK') {
          const payload = op.payload as any;
          await api.post(`/projects/${payload.projectId}/tasks`, payload);
        } else if (op.type === 'UPDATE_TASK') {
          const payload = op.payload as any;
          await api.patch(`/tasks/${payload.id}`, payload);
        } else if (op.type === 'MOVE_TASK') {
          const payload = op.payload as any;
          await api.post(`/tasks/${payload.taskId}/move`, {
            targetColumnId: payload.targetColumnId,
            newPosition: payload.newPosition,
          });
        } else if (op.type === 'DELETE_TASK') {
          const payload = op.payload as any;
          await api.delete(`/tasks/${payload.taskId}`);
        } else if (op.type === 'ADD_COMMENT') {
          const payload = op.payload as any;
          await api.post(`/tasks/${payload.taskId}/comments`, { content: payload.content });
        }

        if (op.id) await offlineQueue.dequeue(op.id);
      } catch (err) {
        console.error('Failed to sync offline op:', op, err);
        if (op.id) await offlineQueue.incrementRetry(op.id);
      }
    }

    const remaining = await offlineQueue.count();
    setPendingOps(remaining);

    if (remaining === 0) {
      toast.success('All offline changes synced!', { id: 'offline-sync' });
    } else {
      toast.error(`${remaining} changes could not be synced. Will retry later.`, { id: 'offline-sync' });
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      toast.success('Connection restored');
      syncPendingOperations();
    };

    const handleOffline = () => {
      setOnline(false);
      toast('You are offline. Changes will sync when reconnected.', { icon: '⚠️' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    offlineQueue.count().then(setPendingOps);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, pendingOpsCount, syncPendingOperations };
}
