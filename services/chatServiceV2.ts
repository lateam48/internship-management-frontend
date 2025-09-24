
import { apiClient } from '@/lib/axios';
import {
  ChatMessage,
  ChatConversation,
  ChatParticipant,
  SendMessageRequest,
  UpdateMessageRequest,
  ChatApiResponse,
  PaginatedResponse,
} from '@/types/chat-v2';

const BASE_URL = '/chat/v2';

class ChatServiceV2 {
  private mapParticipant(raw: any): ChatParticipant {
    const role = (raw?.role ?? '').toString().toUpperCase();
    const fullName = (raw?.fullName
      ?? [raw?.firstName, raw?.lastName].filter(Boolean).join(' ')
      ?? raw?.name
      ?? '').toString().trim();
    const username = (raw?.username ?? raw?.email ?? '').toString();
    const email = (raw?.email ?? raw?.username ?? '').toString();
    return {
      id: Number(raw?.id),
      username,
      fullName,
      email,
      role,
      isOnline: Boolean(raw?.isOnline ?? false),
      lastSeen: raw?.lastSeen ?? undefined,
    } as ChatParticipant;
  }
  async sendMessage(request: SendMessageRequest): Promise<ChatApiResponse<ChatMessage>> {
    try {
      const response = await apiClient.post<ChatMessage>(`${BASE_URL}/messages`, request);
      return {
        success: true,
        data: response.data,
        message: 'Message sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message',
      };
    }
  }

  async getConversations(
    page = 0,
    size = 20
  ): Promise<ChatApiResponse<PaginatedResponse<ChatConversation>>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ChatConversation>>(
        `${BASE_URL}/conversations`,
        {
          params: { page, size, sort: 'lastMessageAt,desc' },
        }
      );
      return {
        success: true,
        data: response.data,
        message: 'Conversations retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get conversations',
      };
    }
  }

  async getConversationMessages(
    userId: number,
    page = 0,
    size = 50
  ): Promise<ChatApiResponse<PaginatedResponse<ChatMessage>>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ChatMessage>>(
        `${BASE_URL}/conversations/${userId}/messages`,
        {
          params: { page, size, sort: 'createdAt,desc' },
        }
      );
      return {
        success: true,
        data: response.data,
        message: 'Messages retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get messages',
      };
    }
  }

  async updateMessage(
    messageId: number,
    request: UpdateMessageRequest
  ): Promise<ChatApiResponse<ChatMessage>> {
    try {
      const response = await apiClient.put<ChatMessage>(
        `${BASE_URL}/messages/${messageId}`,
        request
      );
      return {
        success: true,
        data: response.data,
        message: 'Message updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update message',
      };
    }
  }

  async deleteMessage(messageId: number): Promise<ChatApiResponse<void>> {
    try {
      await apiClient.delete(`${BASE_URL}/messages/${messageId}`);
      return {
        success: true,
        message: 'Message deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete message',
      };
    }
  }

  async markConversationAsRead(conversationId: number): Promise<ChatApiResponse<void>> {
    try {
      await apiClient.put(`${BASE_URL}/conversations/${conversationId}/read`);
      return {
        success: true,
        message: 'Conversation marked as read',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark as read',
      };
    }
  }

  async getUnreadCount(): Promise<ChatApiResponse<number>> {
    try {
      const response = await apiClient.get<{ unreadCount: number }>(
        `${BASE_URL}/unread-count`
      );
      return {
        success: true,
        data: response.data.unreadCount,
        message: 'Unread count retrieved',
      };
    } catch (error: any) {
      return {
        success: false,
        data: 0,
        error: error.response?.data?.message || 'Failed to get unread count',
      };
    }
  }

  async getOnlineUsers(): Promise<ChatApiResponse<number[]>> {
    try {
      const response = await apiClient.get<{ onlineUserIds: number[] }>(
        `${BASE_URL}/presence`
      );
      return {
        success: true,
        data: Array.isArray(response.data?.onlineUserIds)
          ? response.data.onlineUserIds.map((id) => Number(id)).filter((n) => !Number.isNaN(n))
          : [],
        message: 'Presence retrieved',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to get presence',
      };
    }
  }

  async getEligibleParticipants(): Promise<ChatApiResponse<ChatParticipant[]>> {
    try {
      const response = await apiClient.get<any[]>(`${BASE_URL}/participants`);
      const mapped = (Array.isArray(response.data) ? response.data : [])
        .map((p) => this.mapParticipant(p))
        .filter((p) => !!p.id && !!p.fullName)
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'fr'));
      return {
        success: true,
        data: mapped,
        message: 'Participants retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to get participants',
      };
    }
  }

  async getOrCreateConversation(userId: number): Promise<ChatApiResponse<ChatConversation>> {
    try {
      const response = await apiClient.post<ChatConversation>(
        `${BASE_URL}/conversations/${userId}`
      );
      return {
        success: true,
        data: response.data,
        message: 'Conversation retrieved or created',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get/create conversation',
      };
    }
  }

  async searchMessages(
    query: string,
    page = 0,
    size = 20
  ): Promise<ChatApiResponse<PaginatedResponse<ChatMessage>>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ChatMessage>>(
        `${BASE_URL}/messages/search`,
        {
          params: { query, page, size, sort: 'createdAt,desc' },
        }
      );
      return {
        success: true,
        data: response.data,
        message: 'Search completed',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Search failed',
      };
    }
  }
}

export const chatServiceV2 = new ChatServiceV2();

export default ChatServiceV2;
