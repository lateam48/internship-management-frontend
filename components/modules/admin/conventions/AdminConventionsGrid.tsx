"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock, User, CheckCircle, XCircle, Download, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ConventionResponseDTO } from "@/types"

interface AdminConventionsGridProps {
  conventions: ConventionResponseDTO[] | undefined
  isLoading: boolean
  onApprove: (conventionId: number) => void
  onReject: (conventionId: number, reason: string) => void
  onDownloadPdf: (conventionId: number) => void
  isApproving: (conventionId: number) => boolean
  isRejecting: (conventionId: number) => boolean
  isDownloading: boolean
}

export function AdminConventionsGrid({
  conventions,
  isLoading,
  onApprove,
  onReject,
  onDownloadPdf,
  isApproving,
  isRejecting,
  isDownloading
}: AdminConventionsGridProps) {
  const [rejectReason, setRejectReason] = useState("")
  const [rejectingId, setRejectingId] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "VALIDATED_BY_TEACHER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "APPROVED_BY_ADMIN":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "REJECTED_BY_TEACHER":
      case "REJECTED_BY_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente"
      case "VALIDATED_BY_TEACHER":
        return "Validée par l'enseignant"
      case "APPROVED_BY_ADMIN":
        return "Approuvée"
      case "REJECTED_BY_TEACHER":
        return "Rejetée par l'enseignant"
      case "REJECTED_BY_ADMIN":
        return "Rejetée par l'admin"
      default:
        return status
    }
  }

  const handleReject = (conventionId: number) => {
    if (rejectReason.trim()) {
      onReject(conventionId, rejectReason)
      setRejectingId(null)
      setRejectReason("")
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (conventions?.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Aucune convention trouvée avec ce filtre</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {conventions?.map((convention) => (
        <Card key={convention.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{convention.title}</CardTitle>
                <CardDescription>
                  {convention.studentName} | {convention.companyName}
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
                  onClick={() => onDownloadPdf(convention.id)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Télécharger le PDF
                </Button>

                {convention.status === "VALIDATED_BY_TEACHER" && (
                  <>
                    {rejectingId === convention.id ? (
                      <div className="space-y-2">
                        <Label htmlFor="rejectReason">Motif du rejet</Label>
                        <Textarea
                          id="rejectReason"
                          placeholder="Expliquez pourquoi vous rejetez cette convention..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(convention.id)}
                            disabled={!rejectReason.trim() || isRejecting(convention.id)}
                            className="flex-1"
                          >
                            {isRejecting(convention.id) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Rejet...
                              </>
                            ) : (
                              "Confirmer le rejet"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRejectingId(null)
                              setRejectReason("")
                            }}
                            className="flex-1"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => onApprove(convention.id)}
                          disabled={isApproving(convention.id)}
                          className="flex-1"
                        >
                          {isApproving(convention.id) ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Approbation...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approuver
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectingId(convention.id)}
                          className="flex-1"
                          disabled={isApproving(convention.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 