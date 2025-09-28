"use client"

import { useMemo, useState } from "react"
import { useUserStore, UserStore } from "@/stores/userStore"
import { useApplication } from "@/hooks/useApplication"
import { StudentApplicationsHeader, StudentApplicationsGrid, StudentApplicationsFilters } from "@/components/modules/student/applications"
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
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { getStudentApplications, deleteApplication } = useApplication({ studentId: userId })
  const { data: applications, isLoading, error } = getStudentApplications
  const { mutate, isPending } = deleteApplication

  const filteredApplications = useMemo(() => {
    const list = applications ?? []
    const q = search.trim().toLowerCase()

    const statusMap: Record<string, string> = {
      all: "",
      pending: "PENDING",
      accepted: "ACCEPTED",
      rejected: "REJECTED",
    }

    return list.filter((a) => {
      const matchesSearch = q === "" || a.offerTitle.toLowerCase().includes(q)
      const targetStatus = statusMap[status] ?? ""
      const matchesStatus = targetStatus === "" || a.status === targetStatus
      return matchesSearch && matchesStatus
    })
  }, [applications, search, status])

  const handleDeleteApplication = (id: number) => {
    if (!user?.id) return
    setConfirmDeleteId(id)
  }

  return (
    <div className="space-y-6">
      <StudentApplicationsHeader />
      <StudentApplicationsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />
      {!isLoading && !error && (applications?.length ?? 0) > 0 && filteredApplications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Aucun résultat ne correspond aux filtres.</div>
      ) : (
        <StudentApplicationsGrid
          applications={filteredApplications}
          isLoading={isLoading}
          error={error}
          onDelete={handleDeleteApplication}
          isDeleting={isPending}
        />
      )}
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