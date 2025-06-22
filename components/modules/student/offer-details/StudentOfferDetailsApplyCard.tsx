"use client"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Users, Upload, FileText, CheckCircle } from "lucide-react"
import type { GetInternshipOfferResponseDTO } from "@/types/offer"
import { ApplicationResponseDTO, UserResponseData } from "@/types"
import { UseMutationResult } from "@tanstack/react-query"

export function StudentOfferDetailsApplyCard({
  offer,
  hasApplied,
  createApplicationMutation,
  user,
}: Readonly<{
  offer: GetInternshipOfferResponseDTO
  hasApplied: boolean
  createApplicationMutation: UseMutationResult<
    ApplicationResponseDTO,
    Error,
    { studentId: number; offerId: number; coverLetterFile: File; cvFile: File },
    unknown
  >
  user: UserResponseData | undefined
}>) {
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverLetterFile(e.target.files[0])
    }
  }
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0])
    }
  }
  const handleSubmitApplication = () => {
    if (!user?.id || !coverLetterFile) return
    createApplicationMutation.mutate(
      {
        offerId: offer.id,
        studentId: user.id,
        coverLetterFile,
        cvFile: cvFile || new File([], 'empty'),
      },
      {
        onSuccess: () => {
          setShowApplicationForm(false)
          setCoverLetterFile(null)
          setCvFile(null)
        },
      }
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">
          {hasApplied ? "Candidature envoyée" : "Postuler à cette offre"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasApplied ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-muted-foreground">
              Vous avez déjà postulé à cette offre. Vous pouvez suivre l&apos;état de votre candidature dans la section &quot;Mes candidatures&quot;.
            </p>
            <Link href="/dashboard/applications">
              <Button variant="outline" className="w-full">
                Voir mes candidatures
              </Button>
            </Link>
          </div>
        ) : !showApplicationForm ? (
          <Button className="w-full" onClick={() => setShowApplicationForm(true)}>
            <Users className="h-4 w-4 mr-2" />
            Postuler maintenant
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverLetter">Lettre de motivation (PDF) *</Label>
              <div className="mt-1">
                <Input
                  id="coverLetter"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCoverLetterChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {coverLetterFile && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {coverLetterFile.name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="cv">CV (PDF)</Label>
              <div className="mt-1">
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {cvFile && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {cvFile.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSubmitApplication}
                disabled={!coverLetterFile || createApplicationMutation.isPending}
                className="flex-1"
              >
                {createApplicationMutation.isPending ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Envoyer
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 