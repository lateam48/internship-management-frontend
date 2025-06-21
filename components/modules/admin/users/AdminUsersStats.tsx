"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export function AdminUsersStats({ roleStats, onRoleClick }: { roleStats: Record<string, number>, onRoleClick: (role: string) => void }) {
  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur"
      case "TEACHER":
        return "Enseignant"
      case "COMPANY":
        return "Entreprise"
      case "STUDENT":
        return "Étudiant"
      default:
        return role
    }
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Object.entries(roleStats).map(([role, count]) => (
        <Card
          key={role}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onRoleClick(role)}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-accent">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{getRoleText(role)}</p>
                <p className="text-2xl font-bold text-foreground">{count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 