import { GraduationCap, Users, School, FileText } from "lucide-react"

const stats = [
    { label: "Étudiants gérés", value: "10,000+", icon: GraduationCap, color: "text-primary" },
    { label: "Enseignants actifs", value: "500+", icon: Users, color: "text-primary" },
    { label: "Institutions partenaires", value: "50+", icon: School, color: "text-primary" },
    { label: "Relevés générés", value: "25,000+", icon: FileText, color: "text-primary" },
]

export function HomeStats() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={stat.label} className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}