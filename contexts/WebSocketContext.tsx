"use client";
import {
  createContext,
  useContext,
  useRef,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";

interface WebSocketContextType {
  isConnected: boolean;
  connectWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
  registerRefreshCallback: (callback: () => void) => void;
  unregisterRefreshCallback: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const refreshCallbackRef = useRef<(() => void) | null>(null);

  const connectWebSocket = useCallback(
    (userId: string) => {
      if (stompClientRef.current?.connected) return;

      const client = new Client({
        webSocketFactory: () =>
          new SockJS(`${process.env.NEXT_PUBLIC_WS_URL || 'https://internship-service-3sfp.onrender.com/ws'}`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setIsConnected(true);
          client.subscribe(`/topic/notifications/${userId}`, (message) => {
            const notification = JSON.parse(message.body);
            toast(notification.subject, {
              description: notification.content,
              duration: 5000,
              position: 'top-right',
            });
            if (refreshCallbackRef.current) {
              refreshCallbackRef.current();
            }
          });
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers["message"]);
          console.error("Additional details: " + frame.body);
          setIsConnected(false);
        },
        onWebSocketClose: () => {
          setIsConnected(false);
        },
      });

      stompClientRef.current = client;
      client.activate();
    },
    []
  );

  const disconnectWebSocket = useCallback(() => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.deactivate().then(() => {
        setIsConnected(false);
      });
    }
  }, []);

  const registerRefreshCallback = useCallback((callback: () => void) => {
    refreshCallbackRef.current = callback;
  }, []);

  const unregisterRefreshCallback = useCallback(() => {
    refreshCallbackRef.current = null;
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        connectWebSocket,
        disconnectWebSocket,
        registerRefreshCallback,
        unregisterRefreshCallback,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};