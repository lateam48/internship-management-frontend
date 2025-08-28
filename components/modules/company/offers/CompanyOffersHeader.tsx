"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

interface CompanyOffersHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

export function CompanyOffersHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: CompanyOffersHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou localisation..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actives</SelectItem>
            <SelectItem value="INACTIVE">Inactives</SelectItem>
            <SelectItem value="COMPLETED">Terminées</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 