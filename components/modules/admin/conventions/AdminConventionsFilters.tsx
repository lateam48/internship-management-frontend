"use client"

import { Filter, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const filterSchema = z.object({
  status: z.enum(["ALL", "PENDING", "VALIDATED_BY_TEACHER", "APPROVED_BY_ADMIN", "REJECTED_BY_TEACHER", "REJECTED_BY_ADMIN"]),
  search: z.string().optional(),
})

type FilterFormData = z.infer<typeof filterSchema>

interface AdminConventionsFiltersProps {
  onFiltersChange: (filters: FilterFormData) => void
}

export function AdminConventionsFilters({ onFiltersChange }: AdminConventionsFiltersProps) {
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: "ALL",
      search: "",
    },
  })

  const handleStatusChange = (value: string) => {
    form.setValue("status", value as FilterFormData["status"])
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtres:</span>
        </div>
      </div>
      
      <Form {...form}>
        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par titre, étudiant, entreprise ou localisation..."
                      value={field.value || ""}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
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
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="PENDING">En attente</SelectItem>
                      <SelectItem value="VALIDATED_BY_TEACHER">Validées par l&apos;enseignant</SelectItem>
                      <SelectItem value="APPROVED_BY_ADMIN">Approuvées</SelectItem>
                      <SelectItem value="REJECTED_BY_TEACHER">Rejetées par l&apos;enseignant</SelectItem>
                      <SelectItem value="REJECTED_BY_ADMIN">Rejetées par l&apos;admin</SelectItem>
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