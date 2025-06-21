import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeHero() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                    Trouvez votre stage idéal au{" "}
                    <span className="text-primary">Cameroun</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                    La première plateforme camerounaise dédiée aux stages étudiants. Connectez-vous avec les meilleures
                    entreprises du pays et lancez votre carrière.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button size="lg" className="btn-animate">
                            Commencer maintenant
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="btn-animate">
                            J&apos;ai déjà un compte
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}