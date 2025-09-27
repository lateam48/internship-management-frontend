"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ConventionResponseDTO } from "@/types/convention"
import { MapPin, Clock, Calendar, Upload, Download, Edit, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import { SubmitButton } from "@/components/global"
import type { DownloadConventionPdfMutation, UploadSignedPdfMutation } from "@/types"
import { useRegenerateConventionPdf } from "@/hooks/useConvention"


interface CompanyConventionsCardProps {
  convention: ConventionResponseDTO
  onEdit: () => void
  onDownloadPdf: DownloadConventionPdfMutation
  uploadPdfMutation: UploadSignedPdfMutation
}

export function CompanyConventionsCard({
  convention,
  onEdit,
  onDownloadPdf,
  uploadPdfMutation,
}: Readonly<CompanyConventionsCardProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const regeneratePdfMutation = useRegenerateConventionPdf()
  const [uploading, setUploading] = useState(false)
  const [inputResetKey, setInputResetKey] = useState(0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "VALIDATED_BY_TEACHER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "APPROVED_BY_ADMIN":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "REJECTED_BY_TEACHER":
      case "REJECTED_BY_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRegenerateAndDownload = async () => {
    await regeneratePdfMutation.mutateAsync(convention.id)
    setTimeout(() => {
      onDownloadPdf.mutate(convention.id)
    }, 1000)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-foreground">{convention.title}</CardTitle>
            <CardDescription>Étudiant: {convention.studentName}</CardDescription>
          </div>
          <Badge className={getStatusColor(convention.status)}>{getStatusText(convention.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{convention.description}</p>

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
              Du {format(new Date(convention.startDate), "dd MMM", { locale: fr })} au {format(new Date(convention.endDate), "dd MMM yyyy", { locale: fr })}
            </div>
          </div>

          {convention.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {convention.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {convention.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{convention.skills.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="space-y-2 pt-2">
            {convention.status === "APPROVED_BY_ADMIN" && (
              <div className="space-y-2">
                <Label htmlFor={`file-${convention.id}`} className="text-sm font-medium">
                  Télécharger la convention signée
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id={`file-${convention.id}`}
                    key={`file-${convention.id}-${inputResetKey}`}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <SubmitButton
                    size="sm"
                    onClick={() => {
                      if (!selectedFile) return
                      setUploading(true)
                      uploadPdfMutation.mutate(
                        { id: convention.id, file: selectedFile },
                        {
                          onSuccess: () => {
                            setSelectedFile(null)
                            setInputResetKey((k) => k + 1)
                          },
                          onSettled: () => {
                            setUploading(false)
                          },
                        }
                      )
                    }}
                    disabled={!selectedFile || uploading}
                    loading={uploading}
                    loadingText="Upload..."
                    label="Uploader"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </SubmitButton>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              {convention.status === "APPROVED_BY_ADMIN" && (
                <SubmitButton
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleRegenerateAndDownload}
                  disabled={onDownloadPdf.isPending || regeneratePdfMutation.isPending}
                  loading={onDownloadPdf.isPending || regeneratePdfMutation.isPending}
                  loadingText="Téléchargement..."
                  label="Régénérer & Télécharger PDF"
                >
                  {onDownloadPdf.isPending || regeneratePdfMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Télécharger PDF
                </SubmitButton>
              )}
              {convention.status === "PENDING" && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}