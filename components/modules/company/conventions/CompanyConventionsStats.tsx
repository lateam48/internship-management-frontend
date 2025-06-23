"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConventionResponseDTO } from "@/types/convention"
import { Users, CheckCircle, Clock, FileText } from "lucide-react"

interface CompanyConventionsStatsProps {
  conventions?: ConventionResponseDTO[]
}

export function CompanyConventionsStats({ conventions = [] }: Readonly<CompanyConventionsStatsProps>) {
  const pending = conventions.filter(c => c.status === "PENDING").length
  const validated = conventions.filter(c => c.status === "VALIDATED_BY_TEACHER").length
  const approved = conventions.filter(c => c.status === "APPROVED_BY_ADMIN").length
  const rejected = conventions.filter(c => c.status === "REJECTED_BY_TEACHER" || c.status === "REJECTED_BY_ADMIN").length

  const stats = [
    { title: "Total", value: conventions.length, icon: Users, description: "Toutes les conventions" },
    { title: "En attente", value: pending, icon: Clock, description: "En attente de validation" },
    { title: "Validées", value: validated, icon: CheckCircle, description: "Validées par l'enseignant" },
    { title: "Approuvées", value: approved, icon: FileText, description: "Approuvées par l'admin" },
    { title: "Rejetées", value: rejected, icon: CheckCircle, description: "Rejetées" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map(stat => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}