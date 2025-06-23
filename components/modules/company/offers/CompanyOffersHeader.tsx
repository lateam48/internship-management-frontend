"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function CompanyOffersHeader() {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes offres de stage</h1>
        <p className="mt-2 text-muted-foreground">Gérez vos offres et suivez les candidatures</p>
      </div>
      <Link href="/dashboard/offers/new">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle offre
        </Button>
      </Link>
    </div>
  )
} 