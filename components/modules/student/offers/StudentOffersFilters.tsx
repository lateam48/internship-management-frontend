"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Briefcase, RefreshCw } from "lucide-react"

export function StudentOffersFilters({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  sectorFilter,
  setSectorFilter,
  lengthFilter,
  setLengthFilter,
  sectors,
  sectorsLoading,
  cameroonianCities,
  resetFilters,
  hasActiveFilters,
  error,
  refetch,
  filteredCount,
}: Readonly<{
  searchTerm: string
  setSearchTerm: (v: string) => void
  locationFilter: string
  setLocationFilter: (v: string) => void
  sectorFilter: string
  setSectorFilter: (v: string) => void
  lengthFilter: string
  setLengthFilter: (v: string) => void
  sectors: { id: number; name: string }[] | undefined
  sectorsLoading: boolean
  cameroonianCities: string[]
  resetFilters: () => void
  hasActiveFilters: boolean
  error: unknown
  refetch: () => void
  filteredCount: number
}>) {
  return (
    <div className="mb-8 space-y-4 animate-slide-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un stage, entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="📍 Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {cameroonianCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sectorFilter}
          onValueChange={setSectorFilter}
          disabled={sectorsLoading}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder={
              sectorsLoading ? "Chargement..." : "🏢 Tous les secteurs"
            } />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les secteurs</SelectItem>
            {sectors?.map((sector) => (
              <SelectItem key={sector.id} value={sector.name}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={lengthFilter} onValueChange={setLengthFilter}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="⏱️ Toutes durées" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes durées</SelectItem>
            <SelectItem value="2">2 mois (8 semaines)</SelectItem>
            <SelectItem value="3">3 mois (12 semaines)</SelectItem>
            <SelectItem value="4">4 mois (16 semaines)</SelectItem>
            <SelectItem value="5">5 mois (20 semaines)</SelectItem>
            <SelectItem value="6">6 mois (24 semaines)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground flex items-center">
          <Briefcase className="h-4 w-4 mr-2" />
          {filteredCount} offre(s) trouvée(s)
          {hasActiveFilters && " avec les filtres appliqués"}
        </p>
        <div className="flex space-x-2">
          {Boolean(error) && (
            <Button variant="outline" size="sm" onClick={refetch} className="btn-animate">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          )}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters} className="btn-animate">
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 