"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApplicationResponseDTO } from "@/types"
import { Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useApplication } from "@/hooks/useApplication"
import { useState } from "react"
import { SubmitButton } from "@/components/global/submit-button"

interface CompanyApplicationsCardProps {
  application: ApplicationResponseDTO
  hasExistingConvention: boolean
  onOpenConventionModal: (application: ApplicationResponseDTO) => void
  variant: "pending" | "accepted" | "rejected"
}

export function CompanyApplicationsCard({
  application,
  hasExistingConvention,
  onOpenConventionModal,
  variant
}: Readonly<CompanyApplicationsCardProps>) {
  const { updateApplicationStatus, downloadApplicationBundle } = useApplication()
  const [processingApplicationId, setProcessingApplicationId] = useState<number | null>(null)
  const [processingAction, setProcessingAction] = useState<"ACCEPTED" | "REJECTED" | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Acceptée"
      case "REJECTED":
        return "Rejetée"
      case "PENDING":
        return "En attente"
      default:
        return status
    }
  }

  const getBorderColor = () => {
    switch (variant) {
      case "pending":
        return "border-l-yellow-500"
      case "accepted":
        return "border-l-green-500"
      case "rejected":
        return "border-l-red-500 opacity-75"
      default:
        return ""
    }
  }

  const handleUpdateStatus = (applicationId: number, status: string) => {
    setProcessingApplicationId(applicationId)
    if (status === "ACCEPTED" || status === "REJECTED") {
      setProcessingAction(status)
    }
    updateApplicationStatus.mutate(
      { id: applicationId, status },
      {
        onSettled: () => {
          setProcessingApplicationId(null)
          setProcessingAction(null)
        },
      }
    )
  }

  const handleDownloadBundle = async (applicationId: number) => {
    downloadApplicationBundle.mutate(applicationId)
  }

  const isProcessing = processingApplicationId === application.id
  const isAccepting = isProcessing && processingAction === "ACCEPTED"
  const isRejecting = isProcessing && processingAction === "REJECTED"

  return (
    <Card className={`border-l-4 ${getBorderColor()}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-foreground">
              {application.firstName} {application.lastName}
            </CardTitle>
            <CardDescription>
              {application.offerTitle}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {getStatusText(application.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {format(
              new Date(application.applicationDate),
              "dd MMMM yyyy",
              { locale: fr }
            )}
          </div>

          {variant === "pending" && (
            <div className="flex space-x-2">
              <SubmitButton
                size="sm"
                loading={isAccepting}
                label="Accepter"
                onClick={() => handleUpdateStatus(application.id, "ACCEPTED")}
                className="flex-1"
                btnType="button"
                disabled={isProcessing}
              >
                {isAccepting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-1" />
                )}
                Accepter
              </SubmitButton>
              <SubmitButton
                size="sm"
                loading={isRejecting}
                label="Rejeter"
                onClick={() => handleUpdateStatus(application.id, "REJECTED")}
                className="flex-1"
                btnType="button"
                variant="outline"
                disabled={isProcessing}
              >
                {isRejecting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                Rejeter
              </SubmitButton>
            </div>
          )}

          {variant === "accepted" && (
            <>
              {hasExistingConvention ? (
                <div className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <div className="flex items-center text-green-700 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Convention déjà créée
                    </span>
                  </div>
                </div>
              ) : (
                <SubmitButton
                  size="sm"
                  loading={isProcessing}
                  label="Créer la convention"
                  onClick={() => onOpenConventionModal(application)}
                  className="w-full"
                  btnType="button"
                />
              )}
            </>
          )}

          <SubmitButton
            size="sm"
            variant="outline"
            onClick={() => handleDownloadBundle(application.id)}
            disabled={downloadApplicationBundle.isPending && downloadApplicationBundle.variables === application.id}
            loading={downloadApplicationBundle.isPending && downloadApplicationBundle.variables === application.id}
            loadingText="Téléchargement..."
            label="Télécharger dossier"
            btnType="button"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
