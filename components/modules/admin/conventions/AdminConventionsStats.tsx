"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ConventionResponseDTO } from "@/types"

interface AdminConventionsStatsProps {
  conventions: ConventionResponseDTO[] | undefined
}

export function AdminConventionsStats({ conventions }: AdminConventionsStatsProps) {
  const stats = {
    total: conventions?.length || 0,
    pending: conventions?.filter((c) => c.status === "PENDING").length || 0,
    validated: conventions?.filter((c) => c.status === "VALIDATED_BY_TEACHER").length || 0,
    approved: conventions?.filter((c) => c.status === "APPROVED_BY_ADMIN").length || 0,
    rejected: conventions?.filter((c) => c.status.includes("REJECTED")).length || 0,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.validated}</p>
            <p className="text-sm text-muted-foreground">Validées</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
            <p className="text-sm text-muted-foreground">Approuvées</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
            <p className="text-sm text-muted-foreground">Rejetées</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 