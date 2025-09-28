import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/providers";
import { NotificationCacheKeys } from "@/services/const";
import { notificationService } from "@/services/notificationService";
import { CreateNotificationDTO, NotificationDTO } from "@/types";
import { useCallback } from "react";

export const useNotifications = (params?: {
  userId?: number;
  notificationId?: number;
  unreadOnly?: boolean;
  status?: string;
}) => {
  const { userId, notificationId, unreadOnly, status } = params || {};

  const allNotifications = useQuery({
    queryKey: [NotificationCacheKeys.AllNotifications],
    queryFn: notificationService.fetchAllNotifications,
  });

  const userNotifications = useQuery({
    queryKey: [NotificationCacheKeys.UserNotifications, userId, unreadOnly],
    queryFn: () => {
      if (userId === undefined) {
        throw new Error("User ID is required");
      }
      return notificationService.fetchUserNotifications(userId, unreadOnly);
    },
    enabled: !!userId,
  });

  const notificationById = useQuery({
    queryKey: [NotificationCacheKeys.NotificationById, notificationId],
    queryFn: () => {
      if (notificationId === undefined) {
        throw new Error("Notification ID is required");
      }
      return notificationService.getNotificationById(notificationId);
    },
    enabled: !!notificationId,
  });

  const notificationByStatus = useQuery({
    queryKey: [NotificationCacheKeys.NotificationByStatus, userId, status],
    queryFn: () => {
      if (userId === undefined || status === undefined) {
        throw new Error("User ID and Status are required");
      }
      return notificationService.getNotificationByStatus(userId, status);
    },
    enabled: !!userId && !!status,
  });

  const createNotification = useMutation({
    mutationFn: notificationService.createAndPostNotification,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.AllNotifications],
      });

      if (variables.userIds && variables.userIds.length > 0) {
        variables.userIds.forEach((userId) => {
          queryClient.invalidateQueries({
            queryKey: [NotificationCacheKeys.UserNotifications, userId],
            exact: false,
          });

          queryClient.invalidateQueries({
            queryKey: [NotificationCacheKeys.NotificationByStatus, userId],
            exact: false,
          });
        });
      }
      else {
        queryClient.invalidateQueries({
          queryKey: [NotificationCacheKeys.UserNotifications],
          exact: false,
        });

        queryClient.invalidateQueries({
          queryKey: [NotificationCacheKeys.NotificationByStatus],
          exact: false,
        });
      }
    },
  });

  const markAsRead = useMutation({
  mutationFn: notificationService.markNotificationsAsRead,
  onSuccess: (_, variables) => {
    variables.notificationIds.forEach(id => {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationById, id]
      });
      
      queryClient.setQueryData<NotificationDTO[]>(
        [NotificationCacheKeys.AllNotifications],
        (old) => old?.map(n => 
          n.id === id ? {
            ...n,
            recipients: n.recipients?.map(r => 
              r.userId === variables.userId ? {...r, read: true} : r
            )
          } : n
        )
      );
    });

    queryClient.setQueryData(
      [NotificationCacheKeys.UserNotifications, variables.userId, true],
      (old: NotificationDTO[] | undefined) => 
        old?.filter(n => !variables.notificationIds.includes(n.id))
    );
    
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.AllNotifications]
      });
    }, 100);
  }
});

  const archiveNotification = useMutation({
    mutationFn: notificationService.archiveNotification,
    onSuccess: (_, notificationId) => {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.AllNotifications],
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.UserNotifications],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationById, notificationId],
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationByStatus],
        exact: false,
      });
    },
  });

  const updateNotification = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateNotificationDTO }) =>
      notificationService.updateNotification(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.AllNotifications],
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.UserNotifications],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationById, variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationByStatus],
        exact: false,
      });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.AllNotifications],
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.UserNotifications],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationById, id],
      });

      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationByStatus],
        exact: false,
      });
    },
  });

  const deleteUserNotification = useMutation({
    mutationFn: ({
      userId,
      notificationId,
    }: {
      userId: number;
      notificationId: number;
    }) => notificationService.deleteUserNotification(userId, notificationId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.UserNotifications, variables.userId],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [
          NotificationCacheKeys.NotificationById,
          variables.notificationId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          NotificationCacheKeys.NotificationByStatus,
          variables.userId,
        ],
        exact: false,
      });
    },
  });

  const refetchNotifications = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [NotificationCacheKeys.AllNotifications],
    });
    
    if (userId) {
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.UserNotifications, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationByStatus, userId],
        exact: false,
      });
    }
  }, [userId]);

  return {
    allNotifications,
    userNotifications,
    notificationById,
    notificationByStatus,
    refetchNotifications,

    createNotification,
    markAsRead,
    archiveNotification,
    updateNotification,
    deleteNotification,
    deleteUserNotification,
  };
};
