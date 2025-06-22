"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApplicationResponseDTO, ConventionResponseDTO } from "@/types"
import { User } from "lucide-react"
import { CompanyApplicationsCard } from "./CompanyApplicationsCard"
import { CompanyApplicationsDialogs } from "./CompanyApplicationsDialogs"

interface CompanyApplicationsGridProps {
  applications?: ApplicationResponseDTO[]
  conventions?: ConventionResponseDTO[]
  isLoading: boolean
}

export function CompanyApplicationsGrid({ 
  applications = [], 
  conventions = [], 
  isLoading
}: Readonly<CompanyApplicationsGridProps>) {
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponseDTO | null>(null)
  const [isConventionModalOpen, setIsConventionModalOpen] = useState(false)

  const pendingApplications = applications.filter(app => app.status === "PENDING")
  const acceptedApplications = applications.filter(app => app.status === "ACCEPTED")
  const rejectedApplications = applications.filter(app => app.status === "REJECTED")

  const hasExistingConvention = (applicationId: number) => {
    return conventions?.some(convention => convention.applicationId === applicationId) || false
  }

  const handleOpenConventionModal = (application: ApplicationResponseDTO) => {
    setSelectedApplication(application)
    setIsConventionModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Aucune candidature reçue pour le moment
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {pendingApplications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-yellow-600 dark:text-yellow-400">
              En attente ({pendingApplications.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingApplications.map((application) => (
                <CompanyApplicationsCard
                  key={application.id}
                  application={application}
                  hasExistingConvention={hasExistingConvention(application.id)}
                  onOpenConventionModal={handleOpenConventionModal}
                  variant="pending"
                />
              ))}
            </div>
          </div>
        )}

        {acceptedApplications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
              Acceptées ({acceptedApplications.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedApplications.map((application) => (
                <CompanyApplicationsCard
                  key={application.id}
                  application={application}
                  hasExistingConvention={hasExistingConvention(application.id)}
                  onOpenConventionModal={handleOpenConventionModal}
                  variant="accepted"
                />
              ))}
            </div>
          </div>
        )}

        {rejectedApplications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
              Rejetées ({rejectedApplications.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedApplications.map((application) => (
                <CompanyApplicationsCard
                  key={application.id}
                  application={application}
                  hasExistingConvention={hasExistingConvention(application.id)}
                  onOpenConventionModal={handleOpenConventionModal}
                  variant="rejected"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CompanyApplicationsDialogs
        selectedApplication={selectedApplication}
        isConventionModalOpen={isConventionModalOpen}
        onCloseConventionModal={() => {
          setIsConventionModalOpen(false)
          setSelectedApplication(null)
        }}
      />
    </>
  )
} 