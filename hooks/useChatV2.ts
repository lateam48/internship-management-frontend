/**
 * Custom hooks for the chat module
 * These hooks provide a clean interface for using chat functionality
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  useChatStoreV2,
  useChatConversations,
  useChatMessages,
  useActiveConversation,
  useTotalUnreadCount,
  useOnlineUsers,
  useTypingUsers
} from '@/stores/chatStoreV2';
import {
  SendMessageRequest,
  UpdateMessageRequest,
  UseChatReturn,
  ChatMessage,
  ChatConversation,
} from '@/types/chat-v2';

/**
 * Main chat hook
 * Provides all chat functionality in a single hook
 */
export function useChat(): UseChatReturn {
  const { data: session } = useSession();
  // Select only needed actions/fields instead of whole store to avoid re-renders
  // Initialization is handled by ChatProvider
  const clearError = useChatStoreV2((s) => s.clearError);
  const isLoading = useChatStoreV2((s) => s.isLoading);
  const isSending = useChatStoreV2((s) => s.isSending);
  const errorFromStore = useChatStoreV2((s) => s.error);
  const setActiveConversationAction = useChatStoreV2((s) => s.setActiveConversation);
  const loadMessagesAction = useChatStoreV2((s) => s.loadMessages);
  const sendMessageAction = useChatStoreV2((s) => s.sendMessage);
  const updateMessageAction = useChatStoreV2((s) => s.updateMessage);
  const deleteMessageAction = useChatStoreV2((s) => s.deleteMessage);
  const markAsReadAction = useChatStoreV2((s) => s.markAsRead);
  const sendTypingIndicatorAction = useChatStoreV2((s) => s.sendTypingIndicator);
  // const updateUnreadCountAction = useChatStoreV2((s) => s.updateUnreadCount);
  // const getOrCreateConversationAction = useChatStoreV2((s) => s.getOrCreateConversation);
  const conversations = useChatConversations();
  const activeConversationFromStore = useActiveConversation();
  // Ensure null (not undefined) to satisfy UseChatReturn type
  const activeConversation: ChatConversation | null = activeConversationFromStore || null;
  const messages = useChatMessages(activeConversation?.id || 0);
  const totalUnreadCount = useTotalUnreadCount();
  const onlineUsers = useOnlineUsers();
  const typingUsers = useTypingUsers();

  // Initialization is performed in ChatProvider; nothing to do here

  // Actions
  const sendMessage = useCallback(
    async (request: SendMessageRequest) => {
      await sendMessageAction(request);
    },
    [sendMessageAction]
  );

  const updateMessage = useCallback(
    async (messageId: number, request: UpdateMessageRequest) => {
      await updateMessageAction(messageId, request);
    },
    [updateMessageAction]
  );

  const deleteMessage = useCallback(
    async (messageId: number) => {
      await deleteMessageAction(messageId);
    },
    [deleteMessageAction]
  );

  const markAsRead = useCallback(
    async (conversationId: number) => {
      await markAsReadAction(conversationId);
    },
    [markAsReadAction]
  );

  const setActiveConversation = useCallback(
    (conversationId: number) => {
      setActiveConversationAction(conversationId);
    },
    [setActiveConversationAction]
  );

  const loadMoreMessages = useCallback(
    async (conversationId: number) => {
      // For pagination derive page from length passed in by caller or re-fetch length via selector if needed
      const currentMessages = useChatStoreV2.getState().messages[conversationId] || [];
      const page = Math.floor(currentMessages.length / 50);
      await loadMessagesAction(conversationId, page + 1);
    },
    [loadMessagesAction]
  );

  const searchMessages = useCallback(
    async (query: string): Promise<ChatMessage[]> => {
      // This would call the search API
      // For now, return filtered messages from current conversation
      return messages.filter(m => 
        m.content.toLowerCase().includes(query.toLowerCase())
      );
    },
    [messages]
  );

  const sendTypingIndicator = useCallback(
    (recipientId: number, isTyping: boolean) => {
      sendTypingIndicatorAction(recipientId, isTyping);
    },
    [sendTypingIndicatorAction]
  );

  return {
    // State
    conversations,
    activeConversation,
    messages,
    isLoading,
    isSending,
    error: errorFromStore,
    typingUsers,
    onlineUsers,
    totalUnreadCount,

    // Actions
    sendMessage,
    updateMessage,
    deleteMessage,
    markAsRead,
    setActiveConversation,
    loadMoreMessages,
    searchMessages,
    sendTypingIndicator,
  };
}

/**
 * Hook for managing typing indicators
 */
export function useTypingIndicator(recipientId: number | null) {
  const store = useChatStoreV2();
  // Initialize ref with null to satisfy TS and React typings
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const sendTyping = useCallback(
    (typing: boolean) => {
      if (!recipientId) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send typing indicator
      store.sendTypingIndicator(recipientId, typing);
      setIsTyping(typing);

      // Auto-stop typing after 2 seconds
      if (typing) {
        typingTimeoutRef.current = setTimeout(() => {
          store.sendTypingIndicator(recipientId, false);
          setIsTyping(false);
        }, 2000);
      }
    },
    [recipientId, store]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (recipientId && isTyping) {
        store.sendTypingIndicator(recipientId, false);
      }
    };
  }, []);

  return { sendTyping, isTyping };
}

/**
 * Hook for conversation management
 */
export function useConversation(userId: number) {
  const store = useChatStoreV2();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getOrCreate = useCallback(async () => {
    setIsLoading(true);
    await store.getOrCreateConversation(userId);
    
    // Find the conversation
    const conv = store.conversations.find(c => 
      c.participants.some(p => p.id === userId)
    );
    setConversation(conv || null);
    setIsLoading(false);
  }, [userId, store]);

  useEffect(() => {
    if (userId) {
      getOrCreate();
    }
  }, [userId]);

  return { conversation, isLoading, refresh: getOrCreate };
}

/**
 * Hook for unread count badge
 */
export function useUnreadBadge() {
  const totalUnreadCount = useTotalUnreadCount();
  const store = useChatStoreV2();

  useEffect(() => {
    // Update document title with unread count
    const originalTitle = document.title;
    
    if (totalUnreadCount > 0) {
      document.title = `(${totalUnreadCount}) ${originalTitle}`;
    } else {
      document.title = originalTitle.replace(/^\(\d+\)\s/, '');
    }

    return () => {
      document.title = originalTitle;
    };
  }, [totalUnreadCount]);

  const refresh = useCallback(() => {
    store.updateUnreadCount();
  }, [store]);

  return { unreadCount: totalUnreadCount, refresh };
}

/**
 * Hook for eligible participants
 */
export function useEligibleParticipants() {
  const store = useChatStoreV2();
  const participants = store.eligibleParticipants;
  const onlineUsers = useOnlineUsers();

  const participantsWithStatus = participants.map(p => ({
    ...p,
    isOnline: onlineUsers.has(p.id),
  }));

  const refresh = useCallback(() => {
    store.loadEligibleParticipants();
  }, [store]);

  return { participants: participantsWithStatus, refresh };
}

/**
 * Hook for message pagination
 */
export function useMessagePagination(conversationId: number | null) {
  const store = useChatStoreV2();
  const messages = useChatMessages(conversationId || 0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (!conversationId || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const page = Math.floor(messages.length / 50);
    await store.loadMessages(conversationId, page + 1);
    
    // Check if we got new messages
    const newMessages = store.messages[conversationId] || [];
    if (newMessages.length === messages.length) {
      setHasMore(false);
    }
    
    setIsLoadingMore(false);
  }, [conversationId, messages.length, hasMore, isLoadingMore, store]);

  return { messages, hasMore, isLoadingMore, loadMore };
}

/**
 * Hook for real-time connection status
 */
export function useChatConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Check connection status periodically
    const interval = setInterval(() => {
      try {
        // Import is at the top of the file, so we can use it directly
        const { getChatWebSocketService } = require('@/lib/chat-websocket');
        const wsService = getChatWebSocketService();
        setIsConnected(wsService.getIsConnected());
      } catch {
        setIsConnected(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, isReconnecting };
}

// Re-export for convenience
export { 
  useChatConversations,
  useChatMessages,
  useActiveConversation,
  useTotalUnreadCount,
  useOnlineUsers,
  useTypingUsers,
} from '@/stores/chatStoreV2';
