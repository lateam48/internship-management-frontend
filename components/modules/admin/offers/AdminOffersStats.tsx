"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { GetInternshipOfferResponseDTO } from "@/types"

interface AdminOffersStatsProps {
  offers: GetInternshipOfferResponseDTO[] | undefined
}

export function AdminOffersStats({ offers }: AdminOffersStatsProps) {
  const stats = {
    total: offers?.length || 0,
    active: offers?.filter(o => o.status === "ACTIVE").length || 0,
    inactive: offers?.filter(o => o.status === "INACTIVE").length || 0,
    completed: offers?.filter(o => o.status === "COMPLETED").length || 0,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Actives</p>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <BarChart3 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Inactives</p>
              <p className="text-2xl font-bold text-foreground">{stats.inactive}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Terminées</p>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 