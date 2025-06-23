import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase } from "lucide-react"

export function StudentHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue sur votre espace étudiant</h1>
        <p className="text-muted-foreground mt-2">Accédez à vos candidatures et offres de stage.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/applications">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Mes candidatures</CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Suivez vos candidatures à des offres de stage.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/offers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Offres de stage</CardTitle>
              <Briefcase className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Parcourez et postulez aux offres de stage disponibles.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 