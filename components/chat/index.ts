/**
 * Chat Module Components
 * Export all chat components for easy import
 */

export { ChatModule } from './ChatModule';
export { ChatWidget } from './ChatWidget';
export { ChatButton } from './ChatButton';
export { ChatConversationList } from './ChatConversationList';
export { ChatMessageList } from './ChatMessageList';
export { ChatMessageInput } from './ChatMessageInput';
export { ChatHeader } from './ChatHeader';
export { ChatNewConversation } from './ChatNewConversation';
export { default as ChatPanel } from './ChatPanel';
export { ParticipantList } from './ParticipantList';
export { ConversationView } from './ConversationView';

// Re-export hooks for convenience
export {
  useChat,
  useTypingIndicator,
  useConversation,
  useUnreadBadge,
  useEligibleParticipants,
  useMessagePagination,
  useChatConnectionStatus,
  useChatConversations,
  useChatMessages,
  useActiveConversation,
  useTotalUnreadCount,
  useOnlineUsers,
  useTypingUsers,
} from '@/hooks/useChatV2';

// Re-export types
export type {
  ChatMessage,
  ChatConversation,
  ChatParticipant,
  SendMessageRequest,
  UpdateMessageRequest,
  TypingIndicator,
  PresenceStatus,
  ReadReceipt,
  DeleteNotification,
  ChatApiResponse,
  PaginatedResponse,
  ChatState,
  UseChatReturn,
  ChatConfig,
} from '@/types/chat-v2';

export {
  MessageType,
  MessageStatus,
  ConversationType,
} from '@/types/chat-v2';
