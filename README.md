# 🎓 Internship Management System


## 🎯 Objectif
Le système de gestion de stages est une plateforme web complète destinée à faciliter la gestion des stages étudiants. Il permet aux étudiants de postuler à des offres, aux entreprises de publier des offres et gérer les candidatures, aux enseignants de valider les conventions, et aux administrateurs de superviser l'ensemble du processus.


## 🏗️ Principes clés


### Architecture multi-rôles
- **Séparation des responsabilités** : chaque rôle a des permissions et interfaces spécifiques
- **Workflow de validation** : processus structuré pour les candidatures et conventions
- **Authentification centralisée** : système JWT avec NextAuth.js
- **Interface adaptative** : composants dynamiques selon le rôle utilisateur


### Rôles système
- **STUDENT** : consultation d'offres, candidatures, suivi des conventions
- **COMPANY** : publication d'offres, gestion des candidatures, conventions
- **TEACHER** : validation des conventions de stage
- **ADMIN** : supervision complète, gestion des utilisateurs et secteurs


### Flux de validation
1. **Candidature** : étudiant → entreprise → décision
2. **Convention** : entreprise/étudiant → enseignant → validation
3. **Notifications** : alertes automatiques à chaque étape


## 📊 Modèle de données


### Entités principales


#### Users
```typescript
interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole // ADMIN | COMPANY | TEACHER | STUDENT
  sector?: Sector
}
```


#### Offers (Offres de stage)
```typescript
interface InternshipOffer {
  id: number
  title: string
  description: string
  requirements: string
  location: string
  duration: number
  startDate: string
  endDate: string
  status: OfferStatus // ACTIVE | INACTIVE | COMPLETED
  company: User
  sector: Sector
  applications: Application[]
}
```


#### Applications (Candidatures)
```typescript
interface Application {
  id: number
  student: User
  offer: InternshipOffer
  status: ApplicationStatus
  appliedAt: string
  coverLetter?: string
  resume?: string
}
```


#### Conventions
```typescript
interface Convention {
  id: number
  student: User
  company: User
  teacher?: User
  offer: InternshipOffer
  status: ConventionStatus
  validatedAt?: string
  startDate: string
  endDate: string
}
```


#### Sectors (Secteurs d'activité)
```typescript
interface Sector {
  id: number
  name: string
  description?: string
}
```


## 💻 Interfaces utilisateur


### Dashboard étudiant
- **Offres de stage** : recherche, filtrage, candidature
- **Mes candidatures** : suivi du statut, historique
- **Profil** : gestion des informations personnelles


### Dashboard entreprise
- **Mes offres** : création, modification, gestion
- **Candidatures** : évaluation, acceptation/refus
- **Conventions** : suivi et gestion
- **Profil entreprise** : informations société


### Dashboard enseignant
- **Validation conventions** : approbation/rejet avec commentaires
- **Profil** : informations personnelles


### Dashboard administrateur
- **Utilisateurs** : création, modification, suppression
- **Secteurs** : gestion des domaines d'activité
- **Offres** : supervision globale
- **Conventions** : vue d'ensemble et statistiques
- **Profil** : gestion compte admin


## 🧾 Règles de gestion


### Candidatures
- Un étudiant peut postuler à plusieurs offres
- Une candidature par offre par étudiant
- Statuts : PENDING → ACCEPTED/REJECTED
- Notifications automatiques aux parties concernées


### Conventions
- Générées automatiquement après acceptation candidature
- Validation obligatoire par un enseignant
- Statuts : DRAFT → PENDING → VALIDATED/REJECTED
- Dates cohérentes avec l'offre de stage


### Notifications
- Système de notifications en temps réel
- Canaux : IN_APP, EMAIL
- Types : NEW_OFFER, NEW_APPLICATION, CONVENTION_VALIDATION, etc.
- Rappels automatiques pour actions en attente


## 🔑 Permissions


### Permissions par rôle


#### STUDENT
- `VIEW` offres publiques
- `CREATE` candidatures
- `VIEW` ses candidatures et conventions
- `EDIT` son profil


#### COMPANY
- `CREATE`, `EDIT`, `DELETE` ses offres
- `VIEW`, `MANAGE` candidatures sur ses offres
- `VIEW`, `EDIT` ses conventions
- `EDIT` profil entreprise


#### TEACHER
- `VIEW` conventions à valider
- `VALIDATE`, `REJECT` conventions
- `EDIT` son profil


#### ADMIN
- `FULL_ACCESS` à toutes les fonctionnalités
- `MANAGE` utilisateurs, secteurs
- `VIEW` statistiques globales
- `MODERATE` contenu


## 🛠️ Architecture technique


### Stack technologique
- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS v4, Radix UI
- **Authentification** : NextAuth.js avec JWT
- **State Management** : TanStack Query, Zustand
- **Forms** : React Hook Form + Zod validation
- **API** : REST API externe


### Structure du projet
```
app/
├── (auth)/login/          # Authentification
├── (protected)/dashboard/ # Pages protégées
│   ├── @admin/           # Slot admin
│   ├── @company/         # Slot entreprise
│   ├── @student/         # Slot étudiant
│   └── @teacher/         # Slot enseignant
components/
├── ui/                   # Composants de base
├── layout/               # Layout et navigation
├── modules/              # Modules métier
└── global/               # Composants globaux
hooks/                    # Hooks personnalisés
lib/                      # Utilitaires
providers/                # Providers React
services/                 # Services API
types/                    # Types TypeScript
```


### Routing et sécurité
- **App Router** Next.js avec slots parallèles
- **Middleware** d'authentification
- **Protection des routes** par rôle
- **Validation côté serveur** avec Zod


## 📌 User Stories


### Étudiant
- ✅ Consulter les offres de stage disponibles
- ✅ Filtrer les offres par secteur, localisation, durée
- ✅ Postuler à une offre avec CV et lettre de motivation
- ✅ Suivre le statut de mes candidatures
- ✅ Gérer mon profil étudiant


### Entreprise
- ✅ Créer et publier des offres de stage
- ✅ Gérer mes offres (modifier, désactiver)
- ✅ Consulter les candidatures reçues
- ✅ Accepter/refuser des candidatures
- ✅ Gérer les conventions de stage
- ✅ Mettre à jour le profil entreprise


### Enseignant
- ✅ Consulter les conventions à valider
- ✅ Valider ou rejeter une convention
- ✅ Ajouter des commentaires de validation
- ✅ Gérer mon profil enseignant


### Administrateur
- ✅ Gérer les utilisateurs (CRUD)
- ✅ Gérer les secteurs d'activité
- ✅ Superviser les offres et conventions
- ✅ Consulter les statistiques globales
- ✅ Modérer le contenu


## 🚀 Installation et déploiement


### Prérequis
- Node.js 18+
- npm ou pnpm
- Accès à l'API backend


### Installation


1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd internship-management-frontend
   ```


2. **Installer les dépendances**
   ```bash
   pnpm install
   # ou
   npm install
   ```


3. **Configuration environnement**
   ```bash
   cp env.template .env
   ```
   
   Variables requises :
   ```env
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="https://internship-service-3sfp.onrender.com/api/v1"
   ```


4. **Lancer le serveur de développement**


   ```bash
   pnpm dev
   # ou
   npm run dev
   ```


5. **Accéder à l'application**
   Ouvrir [http://localhost:3000](http://localhost:3000)


### Scripts disponibles
```bash
pnpm dev      # Serveur de développement avec Turbopack
pnpm build    # Build de production
pnpm start    # Serveur de production
pnpm lint     # Linting du code
```


## 📈 Statut du projet


### ✅ Fonctionnalités implémentées
- Authentification multi-rôles
- Gestion des offres de stage
- Système de candidatures
- Validation des conventions
- Gestion des profils utilisateur
- Interface responsive
- Notifications en temps réel


### 🚧 En développement
- Système de rappels automatiques
- Statistiques avancées
- Export de données
- API de notifications email


### 📋 Roadmap
- Module de reporting
- Intégration calendrier
- Système de notation
- Application mobile


---


**Version** : 0.1.0  
**Dernière mise à jour** : 2025  
**Licence** : Voir fichier LICENSE
**Équipe** : Team 48  | Jake Melvin TIOKOU  - Belvinard POUADJEU - YOUMSSI TOGUEM Jean Vincent - Hassan Mahamat DOGO - Loïc Luc KENMOE MBEUKEM









