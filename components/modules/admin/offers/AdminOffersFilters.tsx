"use client"

import { Filter } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { OfferStatus, Sector } from "@/types"

const filterSchema = z.object({
  status: z.enum(["ALL", "ACTIVE", "INACTIVE", "COMPLETED"]),
  sector: z.string(),
})

type FilterFormData = z.infer<typeof filterSchema>

interface AdminOffersFiltersProps {
  sectors: Sector[] | undefined
  onFiltersChange: (filters: FilterFormData) => void
}

export function AdminOffersFilters({ sectors, onFiltersChange }: AdminOffersFiltersProps) {
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: "ALL",
      sector: "ALL",
    },
  })

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

  return (
    <div className="mb-6 flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtres:</span>
      </div>
      
      <Form {...form}>
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
        </div>
      </Form>
    </div>
  )
} 