import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function CreateOfferHeader() {
  return (
    <div className="mb-6">
      <Link href="/dashboard/offers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux offres
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mt-4">Publier une nouvelle offre de stage</h1>
      <p className="text-muted-foreground">Créez une offre attractive pour attirer les meilleurs étudiants</p>
    </div>
  )
} 