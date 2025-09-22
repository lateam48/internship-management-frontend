"use client";

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useChatStoreV2 } from '@/stores/chatStoreV2';
import { getChatWebSocketService } from '@/lib/chat-websocket';

interface ChatProviderProps {
  children: React.ReactNode;
}

/**
 * Chat Provider
 * Initializes the chat module for authenticated users (STUDENT and COMPANY only)
 */
export function ChatProvider({ children }: ChatProviderProps) {
  const { data: session } = useSession();
  // Select only the needed actions to avoid resubscribing to the whole store
  const initializeChat = useChatStoreV2((s) => s.initializeChat);
  const cleanupChat = useChatStoreV2((s) => s.cleanupChat);
  const setCurrentUserId = useChatStoreV2((s) => s.setCurrentUserId);

  // Keep stable refs for actions to avoid adding them in effect deps
  const initRef = useRef(initializeChat);
  const cleanupRef = useRef(cleanupChat);
  useEffect(() => {
    initRef.current = initializeChat;
    cleanupRef.current = cleanupChat;
  }, [initializeChat, cleanupChat]);

  // Track initialization and last seen auth key
  const initializedRef = useRef(false);
  const lastAuthKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Only initialize for STUDENT and COMPANY roles
    const userRole = session?.user?.role;
    const token = session?.accessToken;
    const authKey = `${userRole ?? ''}|${token ?? ''}`;
    const userIdStr = session?.user?.id;
    const currentUserId = userIdStr ? parseInt(userIdStr, 10) : null;

    // Only act when the (role, token) pair actually changes
    if (lastAuthKeyRef.current === authKey) return;

    // If we were initialized for a previous authKey, cleanup first
    if (initializedRef.current) {
      initializedRef.current = false;
      cleanupRef.current();
    }

    // Initialize for the new authKey if applicable
    if (token && (userRole === 'STUDENT' || userRole === 'COMPANY')) {
      // Save current user id to the chat store for correct participant detection
      setCurrentUserId(currentUserId);
      initializedRef.current = true;
      initRef.current(token).catch((error) => {
        console.error('Failed to initialize chat:', error);
      });
    }

    lastAuthKeyRef.current = authKey;
  }, [session?.user?.role, session?.accessToken]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (initializedRef.current) {
        initializedRef.current = false;
        cleanupRef.current();
      }
    };
  }, []);

  return <>{children}</>;
}
