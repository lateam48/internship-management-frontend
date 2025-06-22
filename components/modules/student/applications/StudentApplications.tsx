"use client"

import { useUserStore, UserStore } from "@/stores/userStore"
import { useApplication } from "@/hooks/useApplication"
import { StudentApplicationsHeader, StudentApplicationsGrid } from "@/components/modules/student/applications"

export function StudentApplications() {
  const user = useUserStore((state: UserStore) => state.user)
  const userId = user?.id
  const { getStudentApplications, deleteApplication } = useApplication({ studentId: userId })
  const { data: applications, isLoading, error } = getStudentApplications
  const { mutate, isPending } = deleteApplication

  const handleDeleteApplication = (id: number) => {
    if (
      user?.id &&
      confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")
    ) {
      mutate({ id, studentId: user.id })
    }
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
    </div>
  )
} 