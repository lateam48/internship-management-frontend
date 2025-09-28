"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface AdminUsersHeaderProps {
  onOpenCreateDialog: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function AdminUsersHeader({ onOpenCreateDialog, searchValue, onSearchChange }: AdminUsersHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des utilisateurs</h1>
          <p className="mt-2 text-muted-foreground">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <Button onClick={onOpenCreateDialog} variant="default">
          + Nouvel utilisateur
        </Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par nom, prénom ou email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
} 