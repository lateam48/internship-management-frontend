"use client"

import { useState } from "react"
import { useUserStore, UserStore } from "@/stores/userStore"
import { useApplication } from "@/hooks/useApplication"
import { StudentApplicationsHeader, StudentApplicationsGrid } from "@/components/modules/student/applications"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function StudentApplications() {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { getStudentApplications, deleteApplication } = useApplication({ studentId: userId })
  const { data: applications, isLoading, error } = getStudentApplications
  const { mutate, isPending } = deleteApplication

  const handleDeleteApplication = (id: number) => {
    if (!user?.id) return
    setConfirmDeleteId(id)
  }

  return (
    <div className="space-y-6">
      <StudentApplicationsHeader />
      <StudentApplicationsGrid
        applications={applications}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteApplication}
        isDeleting={isPending}
      />
      <AlertDialog open={confirmDeleteId !== null} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la candidature ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette candidature ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDeleteId !== null && user?.id) {
                  mutate({ id: confirmDeleteId, studentId: user.id })
                  setConfirmDeleteId(null)
                }
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}