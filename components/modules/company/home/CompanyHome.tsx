import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Book } from "lucide-react"

export function CompanyHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue sur votre espace entreprise</h1>
        <p className="text-muted-foreground mt-2">Gérez vos offres, candidatures et conventions de stage.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/offers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Mes Offres</CardTitle>
              <Briefcase className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Créez, gérez et suivez vos offres de stage publiées.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/applications">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Candidatures</CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Consultez et gérez les candidatures reçues pour vos offres.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/conventions">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Conventions</CardTitle>
              <Book className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Suivez et validez les conventions de stage associées à vos offres.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 