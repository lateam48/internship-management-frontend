import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function HomeTestimonials() {
    const testimonials = [
        {
            name: "Amina Bello",
            role: "Étudiante en Informatique",
            university: "Université de Yaoundé I",
            content: "Grady me permet de suivre mes résultats en temps réel. L'interface est claire et intuitive.",
            rating: 5,
        },
        {
            name: "Dr. Françoise Atangana",
            role: "Enseignante",
            university: "École Supérieure Polytechnique",
            content:
                "La saisie des notes est devenue un jeu d'enfant. Les calculs automatiques me font gagner énormément de temps.",
            rating: 5,
        },
        {
            name: "Paul Nkomo",
            role: "Administrateur",
            university: "Institut Universitaire de Technologie",
            content: "Grady a révolutionné notre gestion académique. Les relevés sont générés instantanément et sans erreur.",
            rating: 5,
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Ce que disent nos utilisateurs</h2>
                    <p className="text-muted-foreground">Témoignages d'étudiants, enseignants et administrateurs</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
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
                                        <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}