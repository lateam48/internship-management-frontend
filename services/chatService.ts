import { apiClient } from "@/lib/axios";
import {
  ChatMessage,
  ChatRoom,
  SendMessageRequest,
  ChatApiResponse,
  MessageReaction,
  ChatAttachment,
  ChatParticipant,
  UserRoles,
} from "@/types";

const BASE_URL = "/chat";

function mapParticipant(raw: unknown): ChatParticipant {
  const obj = raw as Record<string, unknown>;
  return {
    id: obj.id as number,
    name: (obj.fullName as string) || (obj.name as string) || '',
    username: (obj.username as string) || (obj.email as string) || '',
    role: ((obj.role as string) || UserRoles.COMPANY) as 'COMPANY' | 'STUDENT',
    avatar: (obj.avatar as string) || undefined,
    isOnline: (obj.isOnline as boolean) ?? true,
    lastSeen: (obj.lastSeen as string) || undefined,
  };
}

function mapMessage(raw: unknown): ChatMessage {
  const obj = raw as Record<string, unknown>;
  return {
    id: String(obj.id),
    content: obj.content as string,
    senderId: obj.senderId as number,
    senderName: obj.senderName as string,
    senderRole: ((obj.senderRole as string) || UserRoles.COMPANY) as 'COMPANY' | 'STUDENT',
    createdAt: (obj.createdAt as string) || (obj.timestamp as string),
    isRead: obj.isRead as boolean,
    reactions: Array.isArray(obj.reactions)
      ? (obj.reactions as MessageReaction[])
      : [],
    attachments: (obj.attachments as ChatAttachment[]) || [],
  };
}

function mapConversation(raw: unknown): ChatRoom {
  const obj = raw as Record<string, unknown>;
  return {
    id: String(obj.id),
    participants: Array.isArray(obj.participants)
      ? (obj.participants as unknown[]).map(mapParticipant)
      : [],
    lastMessage: obj.lastMessage ? mapMessage(obj.lastMessage) : undefined,
    unreadCount: (obj.unreadCount as number) ?? 0,
    createdAt: obj.createdAt as string,
    updatedAt: obj.updatedAt as string,
  };
}

class ChatService {
  // Chat is currently disabled and will return empty data
  async getConversations(): Promise<ChatApiResponse<ChatRoom[]>> {
    return {
      success: false,
      data: [],
      message: "La fonctionnalité de chat est désactivée",
    };
  }

  async getConversation(userId: number): Promise<ChatApiResponse<ChatMessage[]>> {
    return {
      success: false,
      data: [],
      message: "La fonctionnalité de chat est désactivée",
    };
  }

  async sendMessage(request: SendMessageRequest): Promise<ChatApiResponse<ChatMessage>> {
    return {
      success: false,
      // @ts-expect-error disabled
      data: undefined,
      message: "La fonctionnalité de chat est désactivée",
    };
  }

  async getUnreadCount(): Promise<ChatApiResponse<number>> {
    return {
      success: false,
      data: 0,
      message: "La fonctionnalité de chat est désactivée",
    };
  }

  async markAsRead(senderId: number): Promise<ChatApiResponse<void>> {
    return {
      success: false,
      data: undefined,
      message: "La fonctionnalité de chat est désactivée",
    };
  }

  async addReaction(messageId: string, emoji: string): Promise<ChatApiResponse<void>> {
    return {
      success: false,
      data: undefined,
      message: "La fonctionnalité de chat est désactivée",
    };
  }

  async deleteMessage(messageId: string): Promise<ChatApiResponse<void>> {
    return {
      success: false,
      data: undefined,
      message: "La fonctionnalité de chat est désactivée",
    };
  }

  async deleteAllMessages(): Promise<ChatApiResponse<void>> {
    return {
      success: false,
      data: undefined,
      message: "La fonctionnalité de chat est désactivée",
    };
  }
}

export const chatService = new ChatService();
