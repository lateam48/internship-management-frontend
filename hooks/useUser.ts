import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, RegisterRequest, UpdateUserRequest } from '../types/index';
import { userManagementService } from '@/services/userManagementService';
import { queryClient } from '@/providers';
import { UsersCacheKeys } from '@/services/const';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useUser = ({ userId }: {
  userId?: User['id']
}) => {
  const createUser = useMutation({
    mutationFn: ({ data }: { data: RegisterRequest }) =>
      userManagementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UsersCacheKeys.Users]
      })
      toast.success("Utilisateur créée", {
        description: "L'utlisateur a été publiée avec succès.",
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message || "Impossible de créer l'utlisateur",
      })
    }
  })

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: User['id'], data: UpdateUserRequest }) =>
      userManagementService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UsersCacheKeys.Users]
      })
      toast.success("Utilisateur mise à jour", {
        description: "L'utlisateur a été mise à jour avec succès.",
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message || "Impossible de mettre à jour l'utilisateur",
      })
    }
  })

  const getUser = useQuery({
    queryKey: [UsersCacheKeys.Users, userId],
    queryFn: () =>
      userManagementService.getById(userId as User['id']),
    enabled: !!userId
  })

  const deleteUser = useMutation({
    mutationFn: (userId: User['id']) => userManagementService.delete(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [UsersCacheKeys.Users]
      })
  })

  return {
    createUser,
    updateUser,
    getUser,
    deleteUser
  }
}