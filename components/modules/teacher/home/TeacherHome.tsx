import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book } from "lucide-react"

export function TeacherHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue sur votre espace enseignant</h1>
        <p className="text-muted-foreground mt-2">Gérez la validation des conventions de stage de vos étudiants.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/conventions">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Validation des conventions</CardTitle>
              <Book className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Consultez, validez ou rejetez les conventions de stage soumises par vos étudiants.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 