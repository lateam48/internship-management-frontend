import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface CompanyConventionsFiltersProps {
  search: string
  setSearch: (v: string) => void
  status: string
  setStatus: (v: string) => void
}

export function CompanyConventionsFilters({
  search,
  setSearch,
  status,
  setStatus,
}: CompanyConventionsFiltersProps) {
  return (
    <div className="flex flex-1 items-center space-x-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une convention..."
          className="pl-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="validated_by_teacher">Validée par enseignant</SelectItem>
          <SelectItem value="approved_by_admin">Approuvée par admin</SelectItem>
          <SelectItem value="rejected_by_teacher">Rejetée par enseignant</SelectItem>
          <SelectItem value="rejected_by_admin">Rejetée par admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}