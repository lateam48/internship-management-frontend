/**
 * Types for the modular chat module v2
 * These types are designed to be reusable and match the backend DTOs
 */

// Message Types
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
  NOTIFICATION = 'NOTIFICATION'
}

export enum MessageStatus {
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED'
}

// User Info
export interface ChatUserInfo {
  id: number;
  username: string;
  fullName: string;
  role: string;
  avatar?: string;
}

// Message Preview
export interface MessagePreview {
  id: number;
  content: string;
  senderName: string;
}

// Main Message DTO
export interface ChatMessage {
  id: number;
  conversationId: number;
  sender: ChatUserInfo;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: string;
  updatedAt?: string;
  editedAt?: string;
  isEdited: boolean;
  editHistory?: string;
  readByUserIds?: number[];
  isRead?: boolean;
  isDeleted?: boolean;
  metadata?: string;
  replyToId?: number;
  replyTo?: MessagePreview;
}

// Participant DTO
export interface ChatParticipant {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
}

// Conversation Types
export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP'
}

// Conversation DTO
export interface ChatConversation {
  id: number;
  name?: string;
  type: ConversationType;
  participants: ChatParticipant[];
  lastMessagePreview?: string;
  lastMessageAt?: string;
  lastMessageSender?: ChatUserInfo;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  metadata?: string;
}

// Request DTOs
export interface SendMessageRequest {
  recipientId: number;
  content: string;
  type?: string;
  replyToId?: number;
  metadata?: string;
}

export interface UpdateMessageRequest {
  content: string;
  metadata?: string;
}

// WebSocket Events
export interface ChatWebSocketMessage {
  type: 'message' | 'typing' | 'presence' | 'read' | 'delete';
  payload: any;
}

export interface TypingIndicator {
  senderId: number;
  senderName: string;
  isTyping: boolean;
}

export interface PresenceStatus {
  userId: number;
  username: string;
  isOnline: boolean;
  timestamp: number;
}

export interface ReadReceipt {
  conversationId: number;
  readerId: number;
  readerName: string;
}

export interface DeleteNotification {
  messageId: number;
  deletedBy: number;
}

// API Response Types
export interface ChatApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Store State Types
export interface ChatState {
  // Conversations
  conversations: ChatConversation[];
  activeConversationId: number | null;
  
  // Messages
  messages: Record<number, ChatMessage[]>; // conversationId -> messages
  
  // UI State
  isLoading: boolean;
  isSending: boolean;
  isChatOpen: boolean;
  error: string | null;
  
  // Typing indicators
  typingUsers: Record<number, TypingIndicator>; // userId -> typing status
  
  // Online status
  onlineUsers: Set<number>;
  
  // Unread counts
  totalUnreadCount: number;
  
  // Participants
  eligibleParticipants: ChatParticipant[];

  // Auth context (current logged-in user id, used for client-side logic)
  currentUserId: number | null;
}

// Hook Return Types
export interface UseChatReturn {
  // State
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  typingUsers: TypingIndicator[];
  onlineUsers: Set<number>;
  totalUnreadCount: number;
  
  // Actions
  sendMessage: (request: SendMessageRequest) => Promise<void>;
  updateMessage: (messageId: number, request: UpdateMessageRequest) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  setActiveConversation: (conversationId: number) => void;
  loadMoreMessages: (conversationId: number) => Promise<void>;
  searchMessages: (query: string) => Promise<ChatMessage[]>;
  sendTypingIndicator: (recipientId: number, isTyping: boolean) => void;
}

// Configuration
export interface ChatConfig {
  apiBaseUrl: string;
  wsUrl: string;
  enableTypingIndicator?: boolean;
  enablePresence?: boolean;
  enableReadReceipts?: boolean;
  messagePageSize?: number;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}
