// Central chat configuration

import { UserRoles } from '@/types';
import { Client } from '@stomp/stompjs';

export const CHAT_ROLES = [UserRoles.COMPANY, UserRoles.STUDENT] as const;
export type ChatRole = typeof CHAT_ROLES[number];

export const roleLabels: Record<ChatRole, string> = {
  [UserRoles.COMPANY]: 'companies',
  [UserRoles.STUDENT]: 'étudiants',
};


export type ChatWebSocketEvent =
  | { type: 'message'; data: unknown }
  | { type: 'reaction'; data: unknown }
  | { type: 'read'; data: unknown }
  | { type: 'online_status'; data: unknown };

type Listener = (event: ChatWebSocketEvent) => void;

  class ChatWebSocketService {
    private ws: WebSocket | null = null;
    private listeners: Listener[] = [];
    private readonly url: string;
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    private isConnected = false;

    constructor(url: string) {
      this.url = url;
    }

  connect(_token: string) {
    if (this.ws) this.disconnect();
    this.ws = new WebSocket(`${this.url}?token=${encodeURIComponent(_token)}`);
    this.ws.onopen = () => {
      this.isConnected = true;
    };
    this.ws.onclose = () => {
      this.isConnected = false;
      this.reconnect();
    };
    this.ws.onerror = () => {
      this.isConnected = false;
      this.reconnect();
    };
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach((cb) => cb(data));
      } catch {}
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  send(event: ChatWebSocketEvent) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(event));
    }
  }

  onEvent(cb: Listener) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private reconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
    }, 3000);
  }
}

// Chat disabled: instantiate but do not actually connect
export const chatWebSocketService = new ChatWebSocketService(
  ""
);

  type StompMessageListener = (msg: unknown) => void;

  class StompChatService {
    private client: Client | null = null;
    private messageListeners: StompMessageListener[] = [];
    private connected = false;

    connect(_token: string) {
      // Chat disabled: do not establish any connection
      void _token;
      this.connected = false;
      this.client = null;
    }

    disconnect() {
      // Chat disabled: ensure no client
      this.client = null;
      this.connected = false;
    }

    onMessage(cb: StompMessageListener) {
      this.messageListeners.push(cb);
      return () => {
        this.messageListeners = this.messageListeners.filter((l) => l !== cb);
      };
    }

    sendMessage(_destination: string, _body: unknown) {
      // Chat disabled: no-op
      void _destination;
      void _body;
    }
  }

export const stompChatService = new StompChatService();