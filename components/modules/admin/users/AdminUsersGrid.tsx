"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users } from "lucide-react"
import type { User } from "@/types"

export function AdminUsersGrid({
  users,
  isLoading,
  onEdit,
  onDelete,
  deleteUserPending
}: {
  users: User[] | undefined,
  isLoading: boolean,
  onEdit: (user: User) => void,
  onDelete: (userId: number) => void,
  deleteUserPending: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  if (!users?.length) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription>@{user.username}</CardDescription>
              </div>
              <Badge variant="outline">{user.role}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.sector && (
                <Badge variant="outline" className="text-xs">
                  {user.sector.name}
                </Badge>
              )}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(user)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(user.id)}
                  disabled={deleteUserPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 