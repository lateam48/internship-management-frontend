import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function CreateOfferTips() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">💡 Conseils pour une offre attractive</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • <strong>Titre clair :</strong> Utilisez des mots-clés que les étudiants recherchent
          </li>
          <li>
            • <strong>Description détaillée :</strong> Expliquez les missions, l&apos;équipe, et l&apos;environnement
          </li>
          <li>
            • <strong>Compétences précises :</strong> Listez les technologies et soft skills attendues
          </li>
          <li>
            • <strong>Avantages :</strong> Mentionnez la formation, l&apos;encadrement, et les perspectives
          </li>
          <li>
            • <strong>Localisation :</strong> Précisez si le télétravail est possible
          </li>
        </ul>
      </CardContent>
    </Card>
  )
} 