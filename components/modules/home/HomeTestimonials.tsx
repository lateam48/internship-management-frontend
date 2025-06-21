import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function HomeTestimonials() {
    const testimonials = [
        {
            name: "Amina Bello",
            role: "Étudiante en Informatique",
            university: "Université de Yaoundé I",
            content:
                "Grâce à StageLink, j&apos;ai trouvé un stage fantastique chez MTN Cameroun. L&apos;équipe m&apos;a accompagnée tout au long du processus.",
            rating: 5,
        },
        {
            name: "Jean-Claude Mbarga",
            role: "Étudiant en Marketing",
            university: "Université de Douala",
            content:
                "La plateforme est intuitive et les offres sont de qualité. J&apos;ai décroché mon stage de rêve chez Orange Cameroun en quelques clics.",
            rating: 5,
        },
        {
            name: "Dr. Françoise Atangana",
            role: "Responsable RH",
            company: "Total Energies Cameroun",
            content:
                "StageLink nous permet de recruter facilement les meilleurs talents. L&apos;interface est professionnelle et efficace.",
            rating: 5,
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Ce que disent nos utilisateurs</h2>
                    <p className="text-muted-foreground">Témoignages d&apos;étudiants et d&apos;entreprises qui nous font confiance</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="card-hover animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {testimonial.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                                        <CardDescription>{testimonial.role}</CardDescription>
                                        <p className="text-xs text-muted-foreground">{testimonial.university || testimonial.company}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}