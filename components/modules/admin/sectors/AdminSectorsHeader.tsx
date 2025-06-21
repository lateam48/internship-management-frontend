"use client"

import { Button } from "@/components/ui/button"

export function AdminSectorsHeader({ onOpenCreateDialog }: { onOpenCreateDialog: () => void }) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestion des secteurs</h1>
        <p className="mt-2 text-muted-foreground">Gérez les secteurs d&apos;activité de la plateforme</p>
      </div>
      <Button onClick={onOpenCreateDialog} variant="default">
        + Nouveau secteur
      </Button>
    </div>
  )
} 