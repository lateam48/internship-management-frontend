"use client"

import { Filter, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { OfferStatus, Sector, GetInternshipOfferResponseDTO } from "@/types"

const filterSchema = z.object({
  status: z.enum(["ALL", "ACTIVE", "INACTIVE", "COMPLETED"]),
  sector: z.string(),
  company: z.string(),
  search: z.string().optional(),
})

type FilterFormData = z.infer<typeof filterSchema>

interface AdminOffersFiltersProps {
  sectors: Sector[] | undefined
  offers: GetInternshipOfferResponseDTO[] | undefined
  onFiltersChange: (filters: FilterFormData) => void
}

export function AdminOffersFilters({ sectors, offers, onFiltersChange }: AdminOffersFiltersProps) {
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: "ALL",
      sector: "ALL",
      company: "ALL",
      search: "",
    },
  })

  const companies = offers ? [...new Set(offers.map(offer => offer.companyName))].sort() : []

  const handleStatusChange = (value: string) => {
    form.setValue("status", value as OfferStatus | "ALL")
    const currentValues = form.getValues()
    onFiltersChange(currentValues)
  }

  const handleSectorChange = (value: string) => {
    form.setValue("sector", value)
    const currentValues = form.getValues()
    onFiltersChange(currentValues)
  }

  const handleCompanyChange = (value: string) => {
    form.setValue("company", value)
    const currentValues = form.getValues()
    onFiltersChange(currentValues)
  }

  const handleSearchChange = (value: string) => {
    form.setValue("search", value)
    const currentValues = form.getValues()
    onFiltersChange(currentValues)
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtres:</span>
      </div>
      
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par titre, description, localisation ou compétences..."
                      value={field.value || ""}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex items-center space-x-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="ACTIVE">Actives</SelectItem>
                        <SelectItem value="INACTIVE">Inactives</SelectItem>
                        <SelectItem value="COMPLETED">Terminées</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleSectorChange}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tous les secteurs</SelectItem>
                        {sectors?.filter(sector => sector.name !== "ALL").map((sector) => (
                          <SelectItem key={sector.id} value={sector.name}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={handleCompanyChange}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Entreprise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Toutes les entreprises</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  )
} 