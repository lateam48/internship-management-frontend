"use client"

import { Button } from "@/components/ui/button"

export function AdminUsersHeader({ onOpenCreateDialog }: { onOpenCreateDialog: () => void }) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion des utilisateurs</h1>
        <p className="mt-2 text-muted-foreground">Gérez tous les utilisateurs de la plateforme</p>
      </div>
      <Button onClick={onOpenCreateDialog} variant="default">
        + Nouvel utilisateur
      </Button>
    </div>
  )
} 