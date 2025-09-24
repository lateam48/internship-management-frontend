/**
 * Chat Store V2 - Zustand store for chat state management
 * This store is modular and can be easily integrated into any React/Next.js project
 */

import { enableMapSet } from 'immer';
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
  MessageType,
} from '@/types/chat-v2';
import { chatServiceV2 } from '@/services/chatServiceV2';
import { getChatWebSocketService } from '@/lib/chat-websocket';

// Enable Immer plugin to support Map/Set structures in state
enableMapSet();

interface ChatActions {
  // Initialization
  initializeChat: (token: string) => Promise<void>;
  cleanupChat: () => void;
  // Auth context
  setCurrentUserId: (userId: number | null) => void;
  // UI visibility
  setChatOpen: (open: boolean) => void;

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
        isChatOpen: false,
        error: null,
        typingUsers: {},
        onlineUsers: new Set(),
        totalUnreadCount: 0,
        eligibleParticipants: [],
        currentUserId: null,

        // Initialize chat (WebSocket + initial REST data)
        initializeChat: async (token: string) => {
          try {
            // Compute WS URL
            const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
            const wsBase = process.env.NEXT_PUBLIC_WS_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '');
            const wsUrl = process.env.NEXT_PUBLIC_WS_CHAT_URL || wsBase;

            // Initialize WebSocket (do not block REST init if it fails)
            try {
              const wsService = getChatWebSocketService({
                apiBaseUrl: apiBase,
                wsUrl,
                enableTypingIndicator: true,
                enablePresence: true,
                enableReadReceipts: true,
                messagePageSize: 50,
              });

              await wsService.connect(token);

              // WS handlers
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
            } catch (wsError) {
              console.error('WebSocket connection failed; continuing with REST-only chat init.', wsError);
            }

            // Load initial REST data
            await Promise.all([
              get().loadConversations(),
              get().loadEligibleParticipants(),
              get().updateUnreadCount(),
            ]);
          } catch (error) {
            console.error('Failed to initialize chat:', error);
            set((state) => { state.error = 'Failed to initialize chat'; });
          }
        },

        // Cleanup chat
        cleanupChat: () => {
          try {
            const wsService = getChatWebSocketService();
            wsService.disconnect();
          } catch {}
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

        // Set current user id (from session)
        setCurrentUserId: (userId: number | null) => {
          set((state) => {
            state.currentUserId = userId ?? null;
          });
        },

        // Load conversations
        loadConversations: async () => {
          set((state) => { state.isLoading = true; });
          const response = await chatServiceV2.getConversations();
          if (response.success && response.data) {
            set((state) => {
              state.conversations = response.data!.content;
              state.isLoading = false;
            });
          } else {
            set((state) => {
              state.error = response.error || 'Failed to load conversations';
              state.isLoading = false;
            });
          }
        },

        // Set active conversation with visibility guard
        setActiveConversation: (conversationId: number | null) => {
          set((state) => { state.activeConversationId = conversationId; });
          if (conversationId) {
            // Subscribe to conversation events
            try {
              const wsService = getChatWebSocketService();
              wsService.subscribeToConversation(conversationId);
            } catch {}

            // Always fetch the latest page to ensure we have full context (not only unread)
            get().loadMessages(conversationId);

            // Mark as read only when chat UI is visible
            if (get().isChatOpen) {
              get().markAsRead(conversationId);
            }
          }
        },

        // Get or create conversation
        getOrCreateConversation: async (userId: number) => {
          set((state) => { state.isLoading = true; });

          const response = await chatServiceV2.getOrCreateConversation(userId);
          
          if (response.success && response.data) {
            const conv = response.data;
            set((state) => {
              // Add conversation if not exists
              const exists = state.conversations.find(c => c.id === conv!.id);
              if (!exists) {
                state.conversations.unshift(conv!);
              }
              // Loading flag handled after we set active below
              state.isLoading = false;
            });

            // Use the standard setter to ensure subscription + mark-as-read behavior
            get().setActiveConversation(conv.id);
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

          const currentUserId = get().currentUserId;
          const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
          if (!otherParticipant) return;

          const response = await chatServiceV2.getConversationMessages(otherParticipant.id, page);

          if (response.success && response.data) {
            set((state) => {
              const existing = state.messages[conversationId] || [];
              const pageContent = response.data!.content || [];
              const merged = page === 0 ? pageContent : [...existing, ...pageContent];

              // Deduplicate by id
              const map = new Map<number, ChatMessage>();
              for (const m of merged) {
                if (!map.has(m.id)) map.set(m.id, m);
              }

              // Sort ascending by createdAt so newest is at the bottom
              const sorted = Array.from(map.values()).sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );

              state.messages[conversationId] = sorted;
              state.isLoading = false;
            });

            // Note: do not call markAsRead here to avoid multiple cascading updates.
            // We already mark as read in setActiveConversation when the chat UI is visible.
          } else {
            set((state) => {
              state.error = response.error || 'Failed to load messages';
              state.isLoading = false;
            });
          }
        },

        // Send message
        sendMessage: async (request: SendMessageRequest) => {
          // Begin sending state
          set((state) => {
            state.isSending = true;
          });

          // Create an optimistic message so the UI updates immediately
          const tempId = -Date.now();
          const nowIso = new Date().toISOString();
          const stateSnapshot = get();
          const conversation = stateSnapshot.conversations.find(c =>
            c.participants.some(p => p.id === request.recipientId)
          );
          const conversationId = conversation?.id;

          if (conversationId) {
            const optimisticMessage: ChatMessage = {
              id: tempId,
              conversationId,
              sender: {
                id: stateSnapshot.currentUserId || 0,
                username: '',
                fullName: 'Moi',
                role: '',
              },
              content: request.content,
              type: MessageType.TEXT,
              status: MessageStatus.SENDING,
              createdAt: nowIso,
              isEdited: false,
              replyToId: request.replyToId,
            };

            set((state) => {
              if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
              }
              // Ascending order: append optimistic message at the end
              state.messages[conversationId].push(optimisticMessage);
              // Update conversation preview
              const conv = state.conversations.find(c => c.id === conversationId);
              if (conv) {
                conv.lastMessagePreview = request.content;
                conv.lastMessageAt = nowIso;
              }
            });
          }

          // Send via REST
          const response = await chatServiceV2.sendMessage(request);

          if (response.success && response.data) {
            const serverMsg = response.data;
            set((state) => {
              state.isSending = false;
              if (conversationId) {
                const arr = state.messages[conversationId] || [];
                const idx = arr.findIndex(m => m.id === tempId);
                if (idx !== -1) {
                  arr[idx] = serverMsg;
                  // Remove any duplicate of the same id that may have been added via WebSocket earlier
                  const dupIndex = arr.findIndex((m, i) => m.id === serverMsg.id && i !== idx);
                  if (dupIndex !== -1) {
                    arr.splice(dupIndex, 1);
                  }
                } else {
                  // If optimistic message not found (e.g., list reloaded), ensure message exists
                  // Avoid duplicates: add only if not already present
                  const exists = arr.find(m => m.id === serverMsg.id);
                  if (!exists) arr.push(serverMsg);
                }
                // Update conversation preview from server values
                const conv = state.conversations.find(c => c.id === conversationId);
                if (conv) {
                  conv.lastMessagePreview = serverMsg.content;
                  conv.lastMessageAt = serverMsg.createdAt;
                  conv.lastMessageSender = serverMsg.sender;
                }
              }
            });
          } else {
            set((state) => {
              state.isSending = false;
              state.error = response.error || 'Failed to send message';
              if (conversationId) {
                const arr = state.messages[conversationId];
                if (arr) {
                  const idx = arr.findIndex(m => m.id === tempId);
                  if (idx !== -1) {
                    arr[idx].status = MessageStatus.FAILED;
                  }
                }
              }
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
          const stateNow = useChatStoreV2.getState();
          const isActive = stateNow.activeConversationId === message.conversationId;
          const isChatOpen = stateNow.isChatOpen === true;
          const hasCurrent = stateNow.currentUserId != null;
          const isFromOther = hasCurrent && message.sender.id !== stateNow.currentUserId!;

          set((state) => {
            if (!state.messages[message.conversationId]) {
              state.messages[message.conversationId] = [];
            }

            // Check if message already exists
            const exists = state.messages[message.conversationId].find(m => m.id === message.id);
            if (!exists) {
              // Ascending order: append new incoming message at the end
              state.messages[message.conversationId].push(message);
            }

            // Update conversation preview
            const conversation = state.conversations.find(c => c.id === message.conversationId);
            if (conversation) {
              conversation.lastMessagePreview = message.content;
              conversation.lastMessageAt = message.createdAt;
              conversation.lastMessageSender = message.sender;

              // If the message is from another user
              if (isFromOther) {
                if (isActive && isChatOpen) {
                  // Auto-mark as read in UI and prevent unread counters from increasing
                  const msgs = state.messages[message.conversationId];
                  const last = msgs[msgs.length - 1];
                  if (last && last.id === message.id) {
                    last.isRead = true;
                    last.status = MessageStatus.READ;
                  }
                  // If any unread count existed, clear it and adjust total
                  if (conversation.unreadCount > 0) {
                    state.totalUnreadCount -= conversation.unreadCount;
                    conversation.unreadCount = 0;
                  }
                } else {
                  // Not active: increment unread counters
                  conversation.unreadCount++;
                  state.totalUnreadCount++;
                }
              }
            }
          });

          // If conversation is active, notify backend and send read receipt
          if (isActive && isChatOpen && isFromOther) {
            // Fire-and-forget; avoid blocking UI
            chatServiceV2.markConversationAsRead(message.conversationId).catch(() => {});
            const wsService = getChatWebSocketService();
            wsService.sendReadReceipt(message.conversationId);
          }
        },

        // Set chat open/visible state (controlled by UI container e.g., ChatWidget)
        setChatOpen: (open: boolean) => {
          set((state) => {
            state.isChatOpen = open;
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
