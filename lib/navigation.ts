import { type UserRole, UserRoles } from "@/types"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  FileText,
  Calendar,
  BarChart3,
  UserCheck,
  School,
  Book,
  Hash,
  LucideListChecks,
  Briefcase,
  Building,
} from "lucide-react"

export interface NavigationItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  roles: UserRole[]
}

export const navigationConfig: NavigationItem[] = [
    {
        title: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.COMPANY],
    },
    // Admin specific
    {
        title: "Utilisateurs",
        href: "/dashboard/users",
        icon: Users,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Filieres",
        href: "/dashboard/majors",
        icon: Book,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Niveaux",
        href: "/dashboard/levels",
        icon: Hash,
        roles: [UserRoles.ADMIN],
    },
    {
        title: "Semestres",
        href: "/dashboard/semesters",
        icon: LucideListChecks,
        roles: [UserRoles.ADMIN],
    },
    {
      title: "Cours",
      href: "/dashboard/courses",
      icon: BookOpen,
      roles: [UserRoles.ADMIN],
    },
    {
      title: "Notes",
      href: "/dashboard/grades",
      icon: FileText,
      roles: [UserRoles.ADMIN],
    },
    {
        title: "Transcripts",
        href: "/dashboard/transcripts",
        icon: FileText,
        roles: [UserRoles.ADMIN],
    },
    // Teacher specific
    {
        title: "Cours",
        href: "/dashboard/courses",
        icon: School,
        roles: [UserRoles.TEACHER],
    },
    {
        title: "Étudiants",
        href: "/dashboard/students",
        icon: GraduationCap,
        roles: [UserRoles.TEACHER],
    },
    {
        title: "Évaluations",
        href: "/dashboard/evaluations",
        icon: FileText,
        roles: [UserRoles.TEACHER],
    },
    // Student specific
    {
        title: "Mes cours",
        href: "/dashboard/courses",
        icon: BookOpen,
        roles: [UserRoles.STUDENT],
    },
    {
        title: "Planning",
        href: "/dashboard/schedule",
        icon: Calendar,
        roles: [UserRoles.STUDENT],
    },
    {
        title: "Notes",
        href: "/dashboard/grades",
        icon: UserCheck,
        roles: [UserRoles.STUDENT],
    },
    // Company specific
    {
        title: "Mes Offres",
        href: "/dashboard/offers",
        icon: Briefcase,
        roles: [UserRoles.COMPANY],
    },
    {
        title: "Candidatures",
        href: "/dashboard/applications",
        icon: Users,
        roles: [UserRoles.COMPANY],
    },
    {
        title: "Stages Actifs",
        href: "/dashboard/internships",
        icon: Building,
        roles: [UserRoles.COMPANY],
    },
    {
        title: "Statistiques",
        href: "/dashboard/analytics",
        icon: BarChart3,
        roles: [UserRoles.COMPANY],
    },
    {
        title: "Profil Entreprise",
        href: "/dashboard/profile",
        icon: Building,
        roles: [UserRoles.COMPANY],
    },
    // Common
    {
        title: "Paramètres",
        href: "/dashboard/settings",
        icon: Settings,
        roles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT, UserRoles.COMPANY],
    },
]

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig.filter((item) => item.roles.includes(role))
}
