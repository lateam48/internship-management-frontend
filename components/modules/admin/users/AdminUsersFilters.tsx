"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Filter } from "lucide-react"
import type { UserRole } from "@/types"

export function AdminUsersFilters({ selectedRole, onRoleChange }: { selectedRole: UserRole | "ALL", onRoleChange: (role: UserRole | "ALL") => void }) {
  return (
    <div className="mb-6 flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="roleFilter">Filtrer par rôle:</Label>
      </div>
      <Select value={selectedRole} onValueChange={(value) => onRoleChange(value as UserRole | "ALL")}> 
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rôles</SelectLabel>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="STUDENT">Étudiants</SelectItem>
            <SelectItem value="COMPANY">Entreprises</SelectItem>
            <SelectItem value="TEACHER">Enseignants</SelectItem>
            <SelectItem value="ADMIN">Administrateurs</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
} 