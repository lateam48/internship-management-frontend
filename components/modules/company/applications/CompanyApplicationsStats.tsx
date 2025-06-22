import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationResponseDTO, ConventionResponseDTO } from "@/types"
import { Users, CheckCircle, Clock } from "lucide-react"

interface CompanyApplicationsStatsProps {
  applications?: ApplicationResponseDTO[]
  conventions?: ConventionResponseDTO[]
}

export function CompanyApplicationsStats({ 
  applications = [], 
  conventions = [] 
}: CompanyApplicationsStatsProps) {
  const pendingApplications = applications.filter(app => app.status === "PENDING")
  const acceptedApplications = applications.filter(app => app.status === "ACCEPTED")
  const applicationsWithConventions = applications.filter(app => 
    conventions.some(conv => conv.applicationId === app.id)
  )

  const stats = [
    {
      title: "Total Candidatures",
      value: applications.length,
      icon: Users,
      description: "Toutes les candidatures reçues",
    },
    {
      title: "En Attente",
      value: pendingApplications.length,
      icon: Clock,
      description: "Candidatures en cours d'évaluation",
    },
    {
      title: "Acceptées",
      value: acceptedApplications.length,
      icon: CheckCircle,
      description: "Candidatures acceptées",
    },
    {
      title: "Avec Convention",
      value: applicationsWithConventions.length,
      icon: CheckCircle,
      description: "Conventions créées",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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