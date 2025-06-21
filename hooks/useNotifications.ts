import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/providers";
import { NotificationCacheKeys } from "./const";
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

  // Queries avec gestion sécurisée des paramètres
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

  // Mutations avec invalidations précises
  const createNotification = useMutation({
    mutationFn: notificationService.createAndPostNotification,
    onSuccess: (_, variables) => {
      // Invalidation globale
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.AllNotifications],
      });

      // Invalidation pour tous les utilisateurs concernés
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
      // Invalidation globale si aucune cible spécifique (rôle/secteur)
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
    // Invalidation PRÉCISE des caches
    variables.notificationIds.forEach(id => {
      // 1. Invalider la notification spécifique
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.NotificationById, id]
      });
      
      // 2. Invalider dans la liste globale
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

    // 3. Invalidation pour l'utilisateur
    queryClient.setQueryData(
      [NotificationCacheKeys.UserNotifications, variables.userId, true],
      (old: NotificationDTO[] | undefined) => 
        old?.filter(n => !variables.notificationIds.includes(n.id))
    );
    
    // 4. Rafraîchissement global (optionnel mais sûr)
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

      // Invalidation globale UserNotifications (car userId inconnu)
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

      // Invalidation globale UserNotifications
      queryClient.invalidateQueries({
        queryKey: [NotificationCacheKeys.UserNotifications],
        exact: false,
      });

      // Invalidation spécifique
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

      // Invalidation globale UserNotifications
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
      // Invalidation ciblée
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
    }
  }, [queryClient, userId]);

  return {
    // Queries
    allNotifications,
    userNotifications,
    notificationById,
    notificationByStatus,
    refetchNotifications,

    // Mutations
    createNotification,
    markAsRead,
    archiveNotification,
    updateNotification,
    deleteNotification,
    deleteUserNotification,
  };
};
