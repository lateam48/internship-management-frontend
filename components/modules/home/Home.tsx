import {
    HomeHero,
    HomeNav,
    HomeOffers,
    HomeStats,
    HomeTestimonials,
    HomeHowItWorks,
    HomeCta,
    HomeFooter,
} from "@/components/modules/home"

export function Home() {
    return (
        <div className="min-h-screen bg-background">
            <HomeNav />
            <HomeHero />
            <HomeStats />
            <HomeOffers />
            <HomeTestimonials />
            <HomeHowItWorks />
            <HomeCta />
            <HomeFooter />
        </div>
    )
}