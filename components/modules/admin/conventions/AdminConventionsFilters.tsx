"use client"

import { Filter } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

const filterSchema = z.object({
  status: z.enum(["ALL", "PENDING", "VALIDATED_BY_TEACHER", "APPROVED_BY_ADMIN", "REJECTED_BY_TEACHER", "REJECTED_BY_ADMIN"]),
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
    },
  })

  const handleStatusChange = (value: string) => {
    form.setValue("status", value as FilterFormData["status"])
    const currentValues = form.getValues()
    onFiltersChange(currentValues)
  }

  return (
    <div className="mb-6 flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtrer par statut:</span>
      </div>
      
      <Form {...form}>
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
      </Form>
    </div>
  )
} 