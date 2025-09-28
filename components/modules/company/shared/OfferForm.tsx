"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useState, useEffect } from "react"
import { CreateInternshipOfferRequestDTO, GetInternshipOfferResponseDTO } from "@/types"
import { Sector } from "@/types/sector"
import { SubmitButton } from "@/components/global/submit-button"
import { Skeleton } from "@/components/ui/skeleton"

const offerSchema = z.object({
  title: z.string().min(7, "Le titre est requis"),
  description: z.string().min(10, "La description est requise"),
  location: z.string().min(4, "La localisation est requise"),
  length: z.number().min(1, "Durée minimale 1 mois"),
  sector: z.object({
    id: z.number(),
    name: z.string(),
  }),
  skills: z.array(z.string()).optional(),
})

type OfferFormValues = z.infer<typeof offerSchema>

interface OfferFormProps {
  offer?: GetInternshipOfferResponseDTO
  getSectors: { data?: Sector[]; isLoading: boolean; }
  onSubmit: (data: CreateInternshipOfferRequestDTO) => void
  isPending: boolean
  user: { id: number } | null
  loading?: boolean
  onCancel: () => void
  submitButtonText: string
}

export function OfferForm({
  offer,
  getSectors,
  onSubmit,
  isPending,
  user,
  loading = false,
  onCancel,
  submitButtonText,
}: OfferFormProps) {
  const [newSkill, setNewSkill] = useState("")
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: offer?.title || "",
      description: offer?.description || "",
      location: offer?.location || "",
      length: offer?.length || 3,
      sector: offer?.sector || { id: 0, name: "" },
      skills: offer?.skills || [],
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (offer && getSectors.data) {
      const skillsArray = offer.skills ? offer.skills.map(skill => 
        typeof skill === 'string' ? skill : skill
      ) : []
      
      form.reset({
        title: offer.title,
        description: offer.description,
        location: offer.location,
        length: offer.length,
        sector: offer.sector,
        skills: skillsArray,
      })
    }
  }, [offer, getSectors.data, form])

  const addSkill = () => {
    const skill = newSkill.trim()
    if (skill && !form.getValues("skills")?.includes(skill)) {
      form.setValue("skills", [...(form.getValues("skills") || []), skill])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    form.setValue(
      "skills",
      (form.getValues("skills") || []).filter((skill) => skill !== skillToRemove)
    )
  }

  const currentValues = form.watch()
  const hasChanges = offer ? (
    currentValues.title !== offer.title ||
    currentValues.description !== offer.description ||
    currentValues.location !== offer.location ||
    currentValues.length !== offer.length ||
    currentValues.sector?.id !== offer.sector?.id ||
    JSON.stringify(currentValues.skills?.sort()) !== JSON.stringify(offer.skills?.sort())
  ) : true
  
  const isFormValid = form.formState.isValid && form.watch("sector")?.id && form.watch("length") > 0 && hasChanges

  const handleSubmit = (values: OfferFormValues) => {
    if (!user?.id) return
    
    onSubmit({
      title: values.title,
      description: values.description,
      sector: values.sector,
      location: values.location,
      skills: values.skills || [],
      length: values.length,
      companyId: user.id,
    })
  }

  if (loading || getSectors.isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-4 py-8">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-96 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l&apos;offre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Stage Développement Web Frontend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez le poste, les missions, l&apos;environnement de travail..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Soyez précis sur les missions et l&apos;environnement de travail pour attirer les bons candidats.
                  </p>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Yaoundé, Douala, Télétravail..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (en mois) *</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez la durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 mois</SelectItem>
                        <SelectItem value="2">2 mois</SelectItem>
                        <SelectItem value="3">3 mois</SelectItem>
                        <SelectItem value="4">4 mois</SelectItem>
                        <SelectItem value="5">5 mois</SelectItem>
                        <SelectItem value="6">6 mois</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d&apos;activité *</FormLabel>
                  <Select 
                    value={field.value?.id?.toString() || ""} 
                    onValueChange={(value) => {
                      const selectedSector = getSectors.data?.find(s => s.id === Number(value))
                      if (selectedSector) field.onChange(selectedSector)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSectors.data?.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id.toString()}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="skills">Compétences requises</Label>
              <div className="flex space-x-2">
                <Input
                  id="skills"
                  placeholder="Ex: React, Node.js, Python..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {(form.watch("skills") ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.watch("skills") ?? [])?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Ajoutez les compétences techniques et soft skills recherchées.
              </p>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" type="button" onClick={onCancel}>
                Annuler
              </Button>
              <SubmitButton disabled={!isFormValid || isPending} loading={isPending}>
                {submitButtonText}
              </SubmitButton>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}