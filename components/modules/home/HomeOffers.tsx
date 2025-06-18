import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calculator, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeOffers() {
    const features = [
        {
            title: "Calcul automatique des moyennes",
            description: "Calculs automatisés des moyennes par matière, semestre et année académique",
            icon: Calculator,
            category: "Automatisation",
            benefits: ["Précision", "Rapidité", "Fiabilité"],
        },
        {
            title: "Génération de relevés PDF/Excel",
            description: "Création instantanée de relevés officiels en formats PDF et Excel",
            icon: FileText,
            category: "Documents",
            benefits: ["PDF", "Excel", "Officiel"],
        },
        {
            title: "Analyses statistiques",
            description: "Tableaux de bord et statistiques détaillées pour le suivi académique",
            icon: BarChart3,
            category: "Analytics",
            benefits: ["Graphiques", "Tendances", "Rapports"],
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Fonctionnalités principales</h2>
                    <p className="text-muted-foreground">Découvrez les outils qui simplifient la gestion académique</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary">{feature.category}</Badge>
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <feature.icon className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1">
                                    {feature.benefits.map((benefit, benefitIndex) => (
                                        <Badge key={benefitIndex} variant="outline" className="text-xs">
                                            {benefit}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/login">
                        <Button>
                            Découvrir toutes les fonctionnalités
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}