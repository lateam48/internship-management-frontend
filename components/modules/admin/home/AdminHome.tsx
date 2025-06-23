import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, LucideListChecks, Hash, Users } from "lucide-react"

export function AdminHome() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Bienvenue sur votre espace administrateur</h1>
                <p className="text-muted-foreground mt-2">Gérez les conventions, offres, secteurs et utilisateurs de la plateforme.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/conventions">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Conventions</CardTitle>
                            <Book className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Gérez et validez toutes les conventions de stage de la plateforme.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/offers">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Offres</CardTitle>
                            <LucideListChecks className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Consultez et modérez toutes les offres de stage publiées.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/sectors">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Secteurs</CardTitle>
                            <Hash className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                {"Gérez les secteurs d'activité pour les offres et conventions."}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/dashboard/users">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Utilisateurs</CardTitle>
                            <Users className="h-6 w-6 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Gérez les comptes utilisateurs de la plateforme.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}