"use client"

import { useState } from "react"
import { useSectors as useFetchSectors } from "@/hooks/useSectors"
import { useSector } from "@/hooks/useSector"
import { AdminSectorsHeader } from "./AdminSectorsHeader"
import { AdminSectorsStats } from "./AdminSectorsStats"
import { AdminSectorsGrid } from "./AdminSectorsGrid"
import { AdminSectorsDialogs } from "./AdminSectorsDialogs"
import { Sector } from "@/types"

export function AdminSectors() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newSectorName, setNewSectorName] = useState("")
  const [editingSector, setEditingSector] = useState<Sector | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sectorToDeleteId, setSectorToDeleteId] = useState<number | null>(null)

  const { getSectors } = useFetchSectors()
  const { data: sectors, isLoading } = getSectors
  const { createSector, updateSector, deleteSector } = useSector({})

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminSectorsHeader onOpenCreateDialog={() => setIsCreateDialogOpen(true)} />
      <AdminSectorsStats sectors={sectors} />
      <AdminSectorsGrid
        sectors={sectors}
        isLoading={isLoading}
        onEdit={(sector: Sector) => setEditingSector(sector)}
        onDelete={(sectorId: number) => deleteSector.mutate(sectorId)}
      />
      <AdminSectorsDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        newSectorName={newSectorName}
        setNewSectorName={setNewSectorName}
        createSector={createSector}
        editingSector={editingSector}
        setEditingSector={(sector: Sector | null) => setEditingSector(sector)}
        updateSector={updateSector}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        sectorToDeleteId={sectorToDeleteId}
        setSectorToDeleteId={(id: number | null) => setSectorToDeleteId(id)}
        deleteSector={deleteSector}
      />
    </div>
  )
}