import { useMutation, useQuery } from '@tanstack/react-query';
import { User, RegisterRequest, UpdateUserRequest } from '../types/index';
import { userManagementService } from '@/services/userManagementService';
import { queryClient } from '@/providers';
import { UsersCacheKeys } from '@/services/const';

import { toast } from './use-toast';

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
      toast({
        title: "Utilisateur créée",
        description: "L'utlisateur a été publiée avec succès.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de créer l'utlisateur",
        variant: "destructive",
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
      toast({
        title: "Utilisateur mise à jour",
        description: "L'utlisateur a été mise à jour avec succès.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour l'utilisateur",
        variant: "destructive",
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