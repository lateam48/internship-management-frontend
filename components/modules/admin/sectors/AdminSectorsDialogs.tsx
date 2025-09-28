"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sector } from "@/types"
import { CreateSectorMutation, UpdateSectorMutation, DeleteSectorMutation } from "@/types/sector"

export function AdminSectorsDialogs({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  newSectorName,
  setNewSectorName,
  createSector,
  editingSector,
  setEditingSector,
  updateSector,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  sectorToDeleteId,
  setSectorToDeleteId,
  deleteSector
}: {
  isCreateDialogOpen: boolean,
  setIsCreateDialogOpen: (open: boolean) => void,
  newSectorName: string,
  setNewSectorName: (name: string) => void,
  createSector: CreateSectorMutation,
  editingSector: Sector | null,
  setEditingSector: (sector: Sector | null) => void,
  updateSector: UpdateSectorMutation,
  isDeleteDialogOpen: boolean,
  setIsDeleteDialogOpen: (open: boolean) => void,
  sectorToDeleteId: number | null,
  setSectorToDeleteId: (id: number | null) => void,
  deleteSector: DeleteSectorMutation
}) {
  const handleCreateSector = () => {
    if (newSectorName.trim()) {
      createSector.mutate(
        { data: newSectorName },
        {
          onSuccess: () => {
            setIsCreateDialogOpen(false)
            setNewSectorName("")
          },
        },
      )
    }
  }
  const handleUpdateSector = () => {
    if (editingSector && editingSector.name.trim()) {
      updateSector.mutate(
        { id: editingSector.id, data: editingSector.name },
        {
          onSuccess: () => setEditingSector(null),
        },
      )
    }
  }
  const handleConfirmDelete = () => {
    if (sectorToDeleteId !== null) {
      deleteSector.mutate(sectorToDeleteId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          setSectorToDeleteId(null)
        },
        onError: () => {
          setIsDeleteDialogOpen(false)
          setSectorToDeleteId(null)
        },
      })
    }
  }
  return (
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau secteur</DialogTitle>
            <DialogDescription>Ajoutez un nouveau secteur d&apos;activité</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="sectorName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du secteur</Label>
              <Input
                id="sectorName"
                placeholder="Ex: Informatique, Marketing..."
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
                className="mt-1 block w-full rounded-md border-border shadow-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleCreateSector}
                disabled={!newSectorName.trim() || createSector.isPending}
                variant="default"
              >
                {createSector.isPending ? "Création..." : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingSector} onOpenChange={() => setEditingSector(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle>Modifier le secteur</DialogTitle>
            <DialogDescription>Modifiez le nom du secteur</DialogDescription>
          </DialogHeader>
          {editingSector && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editSectorName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du secteur</Label>
                <Input
                  id="editSectorName"
                  value={editingSector.name}
                  onChange={(e) => setEditingSector({ ...editingSector, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-border shadow-sm"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingSector(null)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleUpdateSector}
                  disabled={!editingSector.name.trim() || updateSector.isPending}
                  variant="default"
                >
                  {updateSector.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce secteur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 py-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteSector.isPending}
              variant="destructive"
            >
              {deleteSector.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 