import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/stores/authStore';

export interface WsMessage<T = any> {
  type: string;
  payload?: T;
  task?: any;
  taskId?: any;
  comment?: any;
}

type Handler = (event: any) => void;

class WebSocketManager {
  private client: Client | null = null;
  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();
  private handlers: Map<string, Set<Handler>> = new Map();
  private reconnectAttempts = 0;

  connect() {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000),
      onConnect: () => {
        this.reconnectAttempts = 0;
        this.handlers.forEach((_, projectId) => {
          this.subscribeToTopic(projectId);
        });
      },
      onDisconnect: () => {
        this.reconnectAttempts++;
      },
      onStompError: (frame) => {
        console.warn('STOMP warning/error', frame);
      },
    });
    this.client.activate();
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
    this.client = null;
  }

  private subscribeToTopic(projectId: string | number) {
    if (!this.client?.connected) return;
    const destination = `/topic/projects/${projectId}/board`;
    if (this.subscriptions.has(destination)) return;

    const sub = this.client.subscribe(destination, (message) => {
      try {
        const event = JSON.parse(message.body);
        // Normalize payload: if event has task/taskId/comment directly or payload
        const normalized = {
          ...event,
          payload: event.payload ?? event.task ?? { taskId: event.taskId, comment: event.comment },
        };
        const handlers = this.handlers.get(String(projectId));
        handlers?.forEach((h) => h(normalized));
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    });
    this.subscriptions.set(destination, sub);
  }

  subscribe(projectId: string | number, handler: Handler) {
    const key = String(projectId);
    if (!this.handlers.has(key)) this.handlers.set(key, new Set());
    this.handlers.get(key)!.add(handler);
    if (this.client?.connected) {
      this.subscribeToTopic(projectId);
    } else {
      this.connect();
    }
  }

  unsubscribe(projectId: string | number, handler: Handler) {
    const key = String(projectId);
    const set = this.handlers.get(key);
    if (set) {
      set.delete(handler);
      if (set.size === 0) {
        const destination = `/topic/projects/${projectId}/board`;
        this.subscriptions.get(destination)?.unsubscribe();
        this.subscriptions.delete(destination);
        this.handlers.delete(key);
      }
    }
  }

  get isConnected() {
    return this.client?.connected ?? false;
  }
}

export const wsManager = new WebSocketManager();
