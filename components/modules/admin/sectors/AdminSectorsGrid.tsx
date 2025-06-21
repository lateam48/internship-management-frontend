"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Building2 } from "lucide-react"
import { Sector } from "@/types"

export function AdminSectorsGrid({
  sectors,
  isLoading,
  onEdit,
  onDelete
}: {
  sectors: Sector[] | undefined,
  isLoading: boolean,
  onEdit: (sector: Sector) => void,
  onDelete: (sectorId: number) => void
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse rounded-lg shadow-sm border border-border dark:border-border">
            <CardHeader className="pb-2">
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!sectors?.length) {
    return (
      <div className="text-center py-16">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-70" />
        <p className="text-xl font-medium text-muted-foreground">Aucun secteur créé pour le moment</p>
        <p className="text-sm text-gray-500 mt-2">Commencez par ajouter un nouveau secteur ci-dessus.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sectors.map((sector) => (
        <Card key={sector.id} className="hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg border border-border dark:border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center font-semibold text-foreground">
              <Building2 className="h-6 w-6 mr-3 text-primary" />
              {sector.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(sector)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(sector.id)}
                className=""
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 