"use client"

import { Filter, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const filterSchema = z.object({
  status: z.enum(["ALL", "PENDING", "VALIDATED_BY_TEACHER", "REJECTED_BY_TEACHER", "APPROVED_BY_ADMIN", "REJECTED_BY_ADMIN"]),
  search: z.string(),
})

type FilterFormData = z.infer<typeof filterSchema>

interface TeacherConventionsFiltersProps {
  onFiltersChange: (filters: FilterFormData) => void
}

export function TeacherConventionsFilters({ onFiltersChange }: TeacherConventionsFiltersProps) {
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
    <div className="mb-6 flex items-center space-x-4">
      <div className="flex items-center space-x-2 flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom d'étudiant ou entreprise..."
          value={form.watch("search")}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Statut:</span>
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
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="VALIDATED_BY_TEACHER">Validées par enseignant</SelectItem>
                    <SelectItem value="APPROVED_BY_ADMIN">Approuvées</SelectItem>
                    <SelectItem value="REJECTED_BY_TEACHER">Rejetées par enseignant</SelectItem>
                    <SelectItem value="REJECTED_BY_ADMIN">Rejetées par admin</SelectItem>
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