"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminOfferDetailsHeader() {
  return (
    <div className="mb-6">
      <Link href="/dashboard/offers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des offres
        </Button>
      </Link>
    </div>
  )
} 