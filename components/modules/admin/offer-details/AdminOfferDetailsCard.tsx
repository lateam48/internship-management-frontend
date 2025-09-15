"use client"

import { MapPin, Clock, Building, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GetInternshipOfferResponseDTO } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AdminOfferDetailsCardProps {
  offer: GetInternshipOfferResponseDTO
  isMutating: boolean
  onActivate: () => void
  onInactivate: () => void
  onComplete: () => void
  isActivating: boolean
  isInactivating: boolean
  isCompleting: boolean
}

export function AdminOfferDetailsCard({
  offer,
  isMutating,
  onActivate,
  onInactivate,
  onComplete,
  isActivating,
  isInactivating,
  isCompleting
}: AdminOfferDetailsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active"
      case "INACTIVE":
        return "Inactive"
      case "COMPLETED":
        return "Terminée"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{offer.title}</CardTitle>
            <CardDescription className="flex items-center text-lg mt-2">
              <Building className="h-5 w-5 mr-2" />
              {offer.companyName}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(offer.status)}>
            {getStatusText(offer.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{offer.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{offer.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{offer.length} mois</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Secteur d&apos;activité</h3>
          <Badge variant="secondary">{offer.sector.name}</Badge>
        </div>

        {offer.skills && offer.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Compétences requises</h3>
            <div className="flex flex-wrap gap-2">
              {offer.skills.map((skill: string | { name: string }, index: number) => (
                <Badge key={index} variant="outline">
                  {typeof skill === 'string' ? skill : skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex space-x-4">
          {offer.status === "ACTIVE" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onInactivate}
              disabled={isMutating}
            >
              {isInactivating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Désactiver l&apos;offre
            </Button>
          )}
          {offer.status === "INACTIVE" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onActivate}
              disabled={isMutating}
            >
              {isActivating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Activer l&apos;offre
            </Button>
          )}
          {offer.status !== "COMPLETED" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isMutating}
                >
                  {isCompleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Marquer comme terminée
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{"Marquer l'offre comme terminée ?"}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Êtes-vous sûr de vouloir marquer cette offre comme terminée ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={onComplete}>Confirmer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 