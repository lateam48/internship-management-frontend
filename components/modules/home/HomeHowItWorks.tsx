import { UserPlus, BookOpen, FileCheck } from "lucide-react"

export function HomeHowItWorks() {
    const howItWorks = [
        {
            step: "1",
            title: "Créez votre compte",
            description: "Inscrivez-vous selon votre rôle : étudiant, enseignant ou administrateur.",
            icon: UserPlus,
        },
        {
            step: "2",
            title: "Gérez les notes",
            description: "Saisissez et validez les notes par matière, niveau et semestre.",
            icon: BookOpen,
        },
        {
            step: "3",
            title: "Générez les relevés",
            description: "Obtenez instantanément des relevés officiels en PDF ou Excel.",
            icon: FileCheck,
        },
    ]

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Comment ça marche</h2>
                    <p className="text-muted-foreground">Gérez vos résultats académiques en 3 étapes simples</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {howItWorks.map((step, index) => (
                        <div key={step.step} className="text-center">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="h-8 w-8 text-primary-foreground" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                    {step.step}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}