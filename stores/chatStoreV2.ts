/**
 * Chat Store V2 - Zustand store for chat state management
 * This store is modular and can be easily integrated into any React/Next.js project
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useMemo } from 'react';
import {
  ChatMessage,
  ChatConversation,
  ChatParticipant,
  SendMessageRequest,
  UpdateMessageRequest,
  TypingIndicator,
  ChatState,
  MessageStatus,
} from '@/types/chat-v2';
import { chatServiceV2 } from '@/services/chatServiceV2';
import { getChatWebSocketService } from '@/lib/chat-websocket';

interface ChatActions {
  // Initialization
  initializeChat: (token: string) => Promise<void>;
  cleanupChat: () => void;

  // Conversations
  loadConversations: () => Promise<void>;
  setActiveConversation: (conversationId: number | null) => void;
  getOrCreateConversation: (userId: number) => Promise<void>;

  // Messages
  loadMessages: (conversationId: number, page?: number) => Promise<void>;
  sendMessage: (request: SendMessageRequest) => Promise<void>;
  updateMessage: (messageId: number, request: UpdateMessageRequest) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  removeMessage: (messageId: number) => void;

  // Read status
  markAsRead: (conversationId: number) => Promise<void>;
  updateUnreadCount: () => Promise<void>;

  // Participants
  loadEligibleParticipants: () => Promise<void>;

  // Typing indicators
  setTypingIndicator: (indicator: TypingIndicator) => void;
  clearTypingIndicator: (userId: number) => void;
  sendTypingIndicator: (recipientId: number, isTyping: boolean) => void;

  // Online status
  setUserOnline: (userId: number) => void;
  setUserOffline: (userId: number) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ChatStore = ChatState & ChatActions;

/**
 * Create the chat store
 */
export const useChatStoreV2 = create<ChatStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        conversations: [],
        activeConversationId: null,
        messages: {},
        isLoading: false,
        isSending: false,
        error: null,
        typingUsers: {},
        onlineUsers: new Set(),
        totalUnreadCount: 0,
        eligibleParticipants: [],

        // Initialize chat
        initializeChat: async (token: string) => {
          try {
            // Initialize WebSocket
            const wsService = getChatWebSocketService({
              apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || '',
              wsUrl: `${process.env.NEXT_PUBLIC_API_URL}/ws-chat` || '',
              enableTypingIndicator: true,
              enablePresence: true,
              enableReadReceipts: true,
              messagePageSize: 50,
            });

            // Connect to WebSocket
            await wsService.connect(token);

            // Setup WebSocket event handlers
            wsService.onMessage((message) => {
              get().addMessage(message);
            });

            wsService.onTyping((indicator) => {
              get().setTypingIndicator(indicator);
            });

            wsService.onPresence((status) => {
              if (status.isOnline) {
                get().setUserOnline(status.userId);
              } else {
                get().setUserOffline(status.userId);
              }
            });

            wsService.onReadReceipt((receipt) => {
              // Update read status for messages
              set((state) => {
                const messages = state.messages[receipt.conversationId];
                if (messages) {
                  messages.forEach((msg) => {
                    if (msg.sender.id !== receipt.readerId && !msg.readByUserIds?.includes(receipt.readerId)) {
                      msg.readByUserIds = [...(msg.readByUserIds || []), receipt.readerId];
                      msg.status = MessageStatus.READ;
                    }
                  });
                }
              });
            });

            wsService.onDelete((notification) => {
              get().removeMessage(notification.messageId);
            });

            // Load initial data
            await Promise.all([
              get().loadConversations(),
              get().loadEligibleParticipants(),
              get().updateUnreadCount(),
            ]);
          } catch (error) {
            console.error('Failed to initialize chat:', error);
            set((state) => {
              state.error = 'Failed to initialize chat';
            });
          }
        },

        // Cleanup chat
        cleanupChat: () => {
          const wsService = getChatWebSocketService();
          wsService.disconnect();
          
          set((state) => {
            state.conversations = [];
            state.activeConversationId = null;
            state.messages = {};
            state.typingUsers = {};
            state.onlineUsers = new Set();
            state.totalUnreadCount = 0;
            state.eligibleParticipants = [];
            state.error = null;
          });
        },

        // Load conversations
        loadConversations: async () => {
          set((state) => {
            state.isLoading = true;
          });

          const response = await chatServiceV2.getConversations();

          if (response.success && response.data) {
            const data = response.data; // narrow to non-undefined
            set((state) => {
              state.conversations = data.content;
              state.isLoading = false;
            });
          } else {
            set((state) => {
              state.error = response.error || 'Failed to load conversations';
              state.isLoading = false;
            });
          }
        },

        // Set active conversation
        setActiveConversation: (conversationId: number | null) => {
          set((state) => {
            state.activeConversationId = conversationId;
          });

          if (conversationId) {
            // Subscribe to conversation events
            const wsService = getChatWebSocketService();
            wsService.subscribeToConversation(conversationId);

            // Load messages if not already loaded
            if (!get().messages[conversationId]) {
              get().loadMessages(conversationId);
            }

            // Mark as read
            get().markAsRead(conversationId);
          }
        },

        // Get or create conversation
        getOrCreateConversation: async (userId: number) => {
          set((state) => {
            state.isLoading = true;
          });

          const response = await chatServiceV2.getOrCreateConversation(userId);
          
          if (response.success && response.data) {
            set((state) => {
              // Add conversation if not exists
              const exists = state.conversations.find(c => c.id === response.data!.id);
              if (!exists) {
                state.conversations.unshift(response.data!);
              }
              state.activeConversationId = response.data!.id;
              state.isLoading = false;
            });

            // Load messages
            await get().loadMessages(response.data.id);
          } else {
            set((state) => {
              state.error = response.error || 'Failed to create conversation';
              state.isLoading = false;
            });
          }
        },

        // Load messages
        loadMessages: async (conversationId: number, page = 0) => {
          set((state) => {
            state.isLoading = true;
          });

          // Find the other participant
          const conversation = get().conversations.find(c => c.id === conversationId);
          if (!conversation) return;

          const otherParticipant = conversation.participants.find(p => p.id !== conversation.id);
          if (!otherParticipant) return;

          const response = await chatServiceV2.getConversationMessages(otherParticipant.id, page);
          
          if (response.success && response.data) {
            set((state) => {
              if (page === 0) {
                state.messages[conversationId] = response.data!.content;
              } else {
                state.messages[conversationId] = [
                  ...(state.messages[conversationId] || []),
                  ...response.data!.content,
                ];
              }
              state.isLoading = false;
            });
          } else {
            set((state) => {
              state.error = response.error || 'Failed to load messages';
              state.isLoading = false;
            });
          }
        },

        // Send message
        sendMessage: async (request: SendMessageRequest) => {
          set((state) => {
            state.isSending = true;
          });

          const response = await chatServiceV2.sendMessage(request);
          
          if (response.success && response.data) {
            // Message will be added via WebSocket
            set((state) => {
              state.isSending = false;
            });

            // Update conversation last message
            set((state) => {
              const conversation = state.conversations.find(
                c => c.participants.some(p => p.id === request.recipientId)
              );
              if (conversation) {
                conversation.lastMessagePreview = request.content;
                conversation.lastMessageAt = new Date().toISOString();
              }
            });
          } else {
            set((state) => {
              state.error = response.error || 'Failed to send message';
              state.isSending = false;
            });
          }
        },

        // Update message
        updateMessage: async (messageId: number, request: UpdateMessageRequest) => {
          const response = await chatServiceV2.updateMessage(messageId, request);
          
          if (response.success && response.data) {
            set((state) => {
              // Find and update the message
              Object.values(state.messages).forEach(messages => {
                const message = messages.find(m => m.id === messageId);
                if (message) {
                  message.content = request.content;
                  message.isEdited = true;
                  message.editedAt = new Date().toISOString();
                }
              });
            });
          } else {
            set((state) => {
              state.error = response.error || 'Failed to update message';
            });
          }
        },

        // Delete message
        deleteMessage: async (messageId: number) => {
          const response = await chatServiceV2.deleteMessage(messageId);
          
          if (response.success) {
            get().removeMessage(messageId);
            
            // Send via WebSocket
            const wsService = getChatWebSocketService();
            wsService.sendDeleteNotification(messageId);
          } else {
            set((state) => {
              state.error = response.error || 'Failed to delete message';
            });
          }
        },

        // Add message
        addMessage: (message: ChatMessage) => {
          set((state) => {
            if (!state.messages[message.conversationId]) {
              state.messages[message.conversationId] = [];
            }
            
            // Check if message already exists
            const exists = state.messages[message.conversationId].find(m => m.id === message.id);
            if (!exists) {
              state.messages[message.conversationId].unshift(message);
            }

            // Update conversation
            const conversation = state.conversations.find(c => c.id === message.conversationId);
            if (conversation) {
              conversation.lastMessagePreview = message.content;
              conversation.lastMessageAt = message.createdAt;
              conversation.lastMessageSender = message.sender;
              
              // Increment unread count if not from current user
              if (message.sender.id !== message.conversationId) {
                conversation.unreadCount++;
                state.totalUnreadCount++;
              }
            }
          });
        },

        // Remove message
        removeMessage: (messageId: number) => {
          set((state) => {
            Object.values(state.messages).forEach(messages => {
              const index = messages.findIndex(m => m.id === messageId);
              if (index !== -1) {
                messages.splice(index, 1);
              }
            });
          });
        },

        // Mark as read
        markAsRead: async (conversationId: number) => {
          const response = await chatServiceV2.markConversationAsRead(conversationId);
          
          if (response.success) {
            set((state) => {
              const conversation = state.conversations.find(c => c.id === conversationId);
              if (conversation) {
                state.totalUnreadCount -= conversation.unreadCount;
                conversation.unreadCount = 0;
              }

              // Mark messages as read
              const messages = state.messages[conversationId];
              if (messages) {
                messages.forEach(msg => {
                  msg.isRead = true;
                  msg.status = MessageStatus.READ;
                });
              }
            });

            // Send read receipt via WebSocket
            const wsService = getChatWebSocketService();
            wsService.sendReadReceipt(conversationId);
          }
        },

        // Update unread count
        updateUnreadCount: async () => {
          const response = await chatServiceV2.getUnreadCount();
          
          if (response.success && response.data !== undefined) {
            set((state) => {
              state.totalUnreadCount = response.data!;
            });
          }
        },

        // Load eligible participants
        loadEligibleParticipants: async () => {
          const response = await chatServiceV2.getEligibleParticipants();
          
          if (response.success && response.data) {
            set((state) => {
              state.eligibleParticipants = response.data!;
            });
          }
        },

        // Set typing indicator
        setTypingIndicator: (indicator: TypingIndicator) => {
          set((state) => {
            if (indicator.isTyping) {
              state.typingUsers[indicator.senderId] = indicator;
              
              // Clear after 3 seconds
              setTimeout(() => {
                get().clearTypingIndicator(indicator.senderId);
              }, 3000);
            } else {
              delete state.typingUsers[indicator.senderId];
            }
          });
        },

        // Clear typing indicator
        clearTypingIndicator: (userId: number) => {
          set((state) => {
            delete state.typingUsers[userId];
          });
        },

        // Send typing indicator
        sendTypingIndicator: (recipientId: number, isTyping: boolean) => {
          const wsService = getChatWebSocketService();
          wsService.sendTypingIndicator(recipientId, isTyping);
        },

        // Set user online
        setUserOnline: (userId: number) => {
          set((state) => {
            // Clone the Set to trigger subscriber updates (avoid in-place mutation)
            const next = new Set(state.onlineUsers);
            next.add(userId);
            state.onlineUsers = next;
          });
        },

        // Set user offline
        setUserOffline: (userId: number) => {
          set((state) => {
            // Clone the Set to trigger subscriber updates (avoid in-place mutation)
            const next = new Set(state.onlineUsers);
            next.delete(userId);
            state.onlineUsers = next;
          });
        },

        // Set error
        setError: (error: string | null) => {
          set((state) => {
            state.error = error;
          });
        },

        // Clear error
        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },
      })),
      {
        name: 'chat-store-v2',
        partialize: (state) => ({
          activeConversationId: state.activeConversationId,
        }),
      }
    )
  )
);

// Export store hooks
export const useChatConversations = () => useChatStoreV2((state) => state.conversations);
// Use a stable empty array to avoid creating a new array each render when no messages exist
const EMPTY_MESSAGES: ChatMessage[] = [];
export const useChatMessages = (conversationId: number) =>
  useChatStoreV2((state) => state.messages[conversationId] ?? EMPTY_MESSAGES);
export const useActiveConversation = () =>
  useChatStoreV2((state) =>
    state.conversations.find((c) => c.id === state.activeConversationId)
  );
export const useTotalUnreadCount = () => useChatStoreV2((state) => state.totalUnreadCount);
export const useOnlineUsers = () => useChatStoreV2((state) => state.onlineUsers);
// Return a typed array of TypingIndicator, with stable snapshot between renders
// Avoid creating a new array in the selector, which can trigger
// "The result of getSnapshot should be cached" in React 18/Next.js
export const useTypingUsers = () => {
  const typingMap = useChatStoreV2((state) => state.typingUsers);
  return useMemo(() => Object.values(typingMap) as TypingIndicator[], [typingMap]);
};
