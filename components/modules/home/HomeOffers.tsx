import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Building, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeOffers() {
    const featuredOffers = [
        {
            title: "Stage Développement Web",
            company: "MTN Cameroun",
            location: "Yaoundé, Centre",
            duration: "3 mois",
            sector: "Informatique",
            skills: ["React", "Node.js", "TypeScript"],
        },
        {
            title: "Stage Marketing Digital",
            company: "Orange Cameroun",
            location: "Douala, Littoral",
            duration: "4 mois",
            sector: "Marketing",
            skills: ["SEO", "Google Ads", "Analytics"],
        },
        {
            title: "Stage Finance",
            company: "Banque Atlantique",
            location: "Yaoundé, Centre",
            duration: "6 mois",
            sector: "Finance",
            skills: ["Excel", "SAP", "Analyse"],
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Offres de stage populaires</h2>
                    <p className="text-muted-foreground">Découvrez quelques-unes des meilleures opportunités disponibles</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredOffers.map((offer, index) => (
                        <Card key={index} className="card-hover animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className="bg-primary/10 text-primary">{offer.sector}</Badge>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-muted-foreground ml-1">Populaire</span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">{offer.title}</CardTitle>
                                <CardDescription className="flex items-center">
                                    <Building className="h-4 w-4 mr-1" />
                                    {offer.company}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                                        {offer.location}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4 mr-2 text-primary" />
                                        {offer.duration}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {offer.skills.map((skill, skillIndex) => (
                                            <Badge key={skillIndex} variant="outline" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/dashboard">
                        <Button className="btn-animate">
                            Voir toutes les offres
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}