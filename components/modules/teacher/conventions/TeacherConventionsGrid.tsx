"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Download, CheckCircle, XCircle, MapPin, Clock, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/global/submit-button"
import { Skeleton } from "@/components/ui/skeleton"
import { ConventionResponseDTO } from "@/types/convention"
import { ApiError } from "@/types"
import { useRegenerateConventionPdf, useUploadSignedPdf } from "@/hooks/useConvention"
import { useState } from "react"
import { Input } from "@/components/ui/input"

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "VALIDATED_BY_TEACHER":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "APPROVED_BY_ADMIN":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "REJECTED_BY_TEACHER":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "PENDING":
      return "En attente de validation"
    case "VALIDATED_BY_TEACHER":
      return "Validée"
    case "APPROVED_BY_ADMIN":
      return "Approuvée par l'admin"
    case "REJECTED_BY_TEACHER":
      return "Rejetée"
    default:
      return status
  }
}

type TeacherConventionsGridProps = Readonly<{
  conventions: ConventionResponseDTO[] | undefined
  loading: boolean
  error: ApiError | null
  onValidate: (id: number) => void
  onReject: (id: number) => void
  onDownloadPdf: (id: number) => void
  rejectReasons: Record<number, string>
  setRejectReasons: React.Dispatch<React.SetStateAction<Record<number, string>>>
  rejectingId: number | null
  setRejectingId: React.Dispatch<React.SetStateAction<number | null>>
  validatingId: number | null
  downloadingConventions: Set<number>
  rejectMutationPending: boolean
  validateMutationPending: boolean
}>

export function TeacherConventionsGrid(props: TeacherConventionsGridProps) {
  const {
    onValidate,
    onReject,
    onDownloadPdf,
    rejectReasons,
    setRejectReasons,
    rejectingId,
    setRejectingId,
    validatingId,
    rejectMutationPending,
    validateMutationPending,
  } = props;

  const pendingConventions = props.conventions?.filter((conv) => conv.status === "PENDING") || []
  const validatedConventions = props.conventions?.filter((conv) => conv.status === "VALIDATED_BY_TEACHER") || []

  const regeneratePdfMutation = useRegenerateConventionPdf()
  const uploadPdfMutation = useUploadSignedPdf()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleRegenerateAndDownload = async (id: number) => {
    await regeneratePdfMutation.mutateAsync(id)
    setTimeout(() => {
      onDownloadPdf(id)
    }, 1000)
  }

  if (props.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-4 w-3/4 mb-2" />
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

  if (props.error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur lors du chargement des conventions</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Impossible de récupérer les conventions. Veuillez réessayer plus tard.</p>
                <p className="mt-1 text-xs">Détails: {props.error?.message ?? "Erreur inconnue"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!props.conventions || props.conventions.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-muted-foreground">Aucune convention à valider pour le moment</p>
          <p className="text-sm text-muted-foreground">
            Les conventions apparaîtront ici lorsque les entreprises en créeront
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Pending Conventions */}
      {pendingConventions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
            En attente de validation ({pendingConventions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingConventions.map((convention) => (
              <Card key={convention.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{convention.title}</CardTitle>
                      <CardDescription>
                        Étudiant: {convention.studentName} | Entreprise: {convention.companyName}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(convention.status)}>
                      {getStatusText(convention.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{convention.description}</p>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {convention.location}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {convention.length} semaines
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Du {format(new Date(convention.startDate), "dd MMM", { locale: fr })} au{" "}
                        {format(new Date(convention.endDate), "dd MMM yyyy", { locale: fr })}
                      </div>
                    </div>
                    {convention.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {convention.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="space-y-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleRegenerateAndDownload(convention.id)}
                        disabled={props.downloadingConventions.has(convention.id) || regeneratePdfMutation.isPending}
                      >
                        {props.downloadingConventions.has(convention.id) || regeneratePdfMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Télécharger PDF
                      </Button>
                      {rejectingId === convention.id ? (
                        <div className="space-y-2">
                          <Label htmlFor="rejectReason" className="text-sm font-medium">
                            Motif du rejet <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="rejectReason"
                            placeholder="Expliquez pourquoi vous rejetez cette convention... (obligatoire)"
                            value={rejectReasons[convention.id] || ""}
                            onChange={(e) => setRejectReasons(prev => ({
                              ...prev,
                              [convention.id]: e.target.value
                            }))}
                            rows={3}
                            className={`${
                              !(rejectReasons[convention.id]?.trim()) 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-green-300 focus:border-green-500'
                            }`}
                          />
                          {!(rejectReasons[convention.id]?.trim()) && (
                            <p className="text-xs text-red-500">
                              Veuillez saisir un motif de rejet avant de confirmer.
                            </p>
                          )}
                          <div className="flex space-x-2">
                            <SubmitButton
                              size="sm"
                              variant="destructive"
                              onClick={() => onReject(convention.id)}
                              disabled={!(rejectReasons[convention.id]?.trim()) || rejectMutationPending}
                              className="flex-1"
                              loading={rejectMutationPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Confirmer le rejet
                            </SubmitButton>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRejectingId(null)
                                setRejectReasons(prev => {
                                  const newReasons = { ...prev }
                                  delete newReasons[convention.id]
                                  return newReasons
                                })
                              }}
                              disabled={rejectMutationPending}
                              className="flex-1"
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <SubmitButton
                            size="sm"
                            onClick={() => onValidate(convention.id)}
                            disabled={validatingId === convention.id}
                            className="flex-1"
                            loading={validateMutationPending && validatingId === convention.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Valider
                          </SubmitButton>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRejectingId(convention.id)}
                            className="flex-1"
                            disabled={validatingId === convention.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* Validated Conventions */}
      {validatedConventions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
            Validées ({validatedConventions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {validatedConventions.map((convention) => (
              <Card key={convention.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{convention.title}</CardTitle>
                      <CardDescription>
                        Étudiant: {convention.studentName} | Entreprise: {convention.companyName}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(convention.status)}>
                      {getStatusText(convention.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {convention.location}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {convention.length} semaines
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Du {format(new Date(convention.startDate), "dd MMM", { locale: fr })} au{" "}
                        {format(new Date(convention.endDate), "dd MMM yyyy", { locale: fr })}
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleRegenerateAndDownload(convention.id)}
                        disabled={props.downloadingConventions.has(convention.id) || regeneratePdfMutation.isPending}
                      >
                        {props.downloadingConventions.has(convention.id) || regeneratePdfMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Télécharger PDF
                      </Button>
                      {convention.status === "VALIDATED_BY_TEACHER" && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                            className="flex-1"
                          />
                          <SubmitButton
                            size="sm"
                            onClick={() => selectedFile && uploadPdfMutation.mutate({ id: convention.id, file: selectedFile })}
                            disabled={!selectedFile || uploadPdfMutation.isPending}
                            loading={uploadPdfMutation.isPending}
                            loadingText="Upload..."
                            label="Uploader PDF signé"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 