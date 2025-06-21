import { apiClient } from '@/lib/axios';
import { MarkReadRequestDTO, ArchiveNotificationRequestDTO, CreateNotificationDTO, NotificationDTO } from '../types/index';

const BASE_URL = "/notifications";

async function fetchAllNotifications(): Promise<NotificationDTO[]> {
  try {
    const response = await apiClient.get(
      `${BASE_URL}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchUserNotifications(userId: number, unreadOnly: boolean | undefined): Promise<NotificationDTO[]> {
  try {
    if (!unreadOnly) {
      const [List1, List2] = await Promise.all([
        apiClient.get(`${BASE_URL}/users/${userId}`,
          {
            params: { unreadOnly: false }
          }
        ),
        apiClient.get(`${BASE_URL}/users/${userId}`,
          {
            params: { unreadOnly: true }
          }
        )
      ]);
      const response = [...List1.data, ...List2.data];
      return response
  }
      else {
        const response = await apiClient.get(
          `${BASE_URL}/users/${userId}`,
          {
            params: { unreadOnly: true }
          }
        );
        return response.data;
      }
} catch (error) {
    console.error(error);
    throw error;
  }
}

async function getNotificationById(id: number): Promise<NotificationDTO> {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getNotificationByStatus(userId: number, status: string): Promise<NotificationDTO[]> {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/status`,
      {
        params: {
          userId: userId,
          status: status,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createAndPostNotification(notification: CreateNotificationDTO): Promise<NotificationDTO> {
    try {
      const response = await apiClient.post(
        `${BASE_URL}`,
        notification
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

async function markNotificationsAsRead(markReadRequestDTO: MarkReadRequestDTO): Promise<void> {
  try {
    await apiClient.patch(
      `${BASE_URL}/mark-read`,
      markReadRequestDTO
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function archiveNotification(archiveNotificationRequestDTO: ArchiveNotificationRequestDTO): Promise<void> {
  try {
    await apiClient.patch(
      `${BASE_URL}/archive`,
      archiveNotificationRequestDTO
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateNotification(id: number, createNotificationDTO: CreateNotificationDTO): Promise<NotificationDTO> {
  try {
    const response = await apiClient.put(
      `${BASE_URL}/${id}`,
      createNotificationDTO
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteNotification(id: number): Promise<void> {
  try {
    await apiClient.delete(
      `${BASE_URL}/${id}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteUserNotification(userId: number, notificationId: number): Promise<void> {
  try {
    await apiClient.delete(
      `${BASE_URL}/${notificationId}/users/${userId}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const notificationService = {
  fetchAllNotifications,
  fetchUserNotifications,
  getNotificationById,
  getNotificationByStatus,
  createAndPostNotification,
  markNotificationsAsRead,
  archiveNotification,
  updateNotification,
  deleteNotification,
  deleteUserNotification
};