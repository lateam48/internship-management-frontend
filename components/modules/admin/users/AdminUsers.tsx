"use client";

import { useUsers } from "@/hooks/useUsers"
import { useUser } from "@/hooks/useUser"
import { useState } from "react"
import type { UserRole, User } from "@/types"
import { CreateUserMutation, UpdateUserMutation, DeleteUserMutation } from "@/types/user"
import { AdminUsersHeader } from "./AdminUsersHeader"
import { AdminUsersStats } from "./AdminUsersStats"
import { AdminUsersFilters } from "./AdminUsersFilters"
import { AdminUsersGrid } from "./AdminUsersGrid"
import { AdminUsersCreateDialog, AdminUsersEditDialog, AdminUsersDeleteDialog } from "./AdminUsersDialogs"
import { useSectors } from "@/hooks/useSectors"

export function AdminUsers() {
  const [selectedRole, setSelectedRole] = useState<UserRole | "ALL">("ALL")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { getSectors } = useSectors();
  const { data: sectors = [] } = getSectors;

  const userFilters = {
    role: selectedRole === "ALL" ? undefined : selectedRole,
  }

  const { getUsers } = useUsers(userFilters)
  const { createUser, updateUser, deleteUser } = useUser({})

  const { data: users, isLoading } = getUsers
  const createUserMutation: CreateUserMutation = createUser
  const updateUserMutation: UpdateUserMutation = updateUser
  const deleteUserMutation: DeleteUserMutation = deleteUser

  // Calculate role statistics
  const roleStats = {
    ADMIN: users?.filter((u) => u.role === "ADMIN").length || 0,
    TEACHER: users?.filter((u) => u.role === "TEACHER").length || 0,
    COMPANY: users?.filter((u) => u.role === "COMPANY").length || 0,
    STUDENT: users?.filter((u) => u.role === "STUDENT").length || 0,
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (userId: number) => {
    const user = users?.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setIsDeleteDialogOpen(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminUsersHeader onOpenCreateDialog={() => setIsCreateDialogOpen(true)} />
      <AdminUsersStats roleStats={roleStats} onRoleClick={role => setSelectedRole(role as UserRole)} />
      <AdminUsersFilters selectedRole={selectedRole} onRoleChange={setSelectedRole} />
      <AdminUsersGrid
        users={users}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteUserPending={deleteUserMutation.isPending}
      />
      
      <AdminUsersCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        createUserMutation={createUserMutation}
      />
      
      <AdminUsersEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={selectedUser}
        updateUserMutation={updateUserMutation}
        sectors={sectors}
      />
      
      <AdminUsersDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        user={selectedUser}
        deleteUserMutation={deleteUserMutation}
      />
    </div>
  )
}