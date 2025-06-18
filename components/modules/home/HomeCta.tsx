import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HomeCta() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Prêt à moderniser votre gestion académique ?</h2>
                <p className="text-primary-foreground/80 mb-8 text-lg">
                    Rejoignez les institutions qui ont choisi Grady pour simplifier leur gestion des résultats académiques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/login">
                        <Button size="lg" variant="secondary">
                            Commencer gratuitement
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className=" text-secondary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
                            Se connecter
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}