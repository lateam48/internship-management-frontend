"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ApplicationResponseDTO } from "@/types"
import { createConventionFormSchema, type CreateConventionFormSchema } from "@/types"
import { Calendar as CalendarIcon,FileText, Upload, X } from "lucide-react"
import { useCreateConventionFromApplication } from "@/hooks/useConvention"
import { SubmitButton } from "@/components/global"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface CompanyApplicationsDialogsProps {
  selectedApplication: ApplicationResponseDTO | null
  isConventionModalOpen: boolean
  onCloseConventionModal: () => void
}

export function CompanyApplicationsDialogs({
  selectedApplication,
  isConventionModalOpen,
  onCloseConventionModal
}: Readonly<CompanyApplicationsDialogsProps>) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [processingApplicationId, setProcessingApplicationId] = useState<number | null>(null)
  
  const createConventionMutation = useCreateConventionFromApplication()

  const form = useForm<CreateConventionFormSchema>({
    resolver: zodResolver(createConventionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      companyName: "",
      companyAddress: "",
      supervisorName: "",
      supervisorEmail: "",
      objectives: "",
      weeklyHours: "",
    },
  })

  const handleSubmitFormConvention = () => {
    if (!selectedApplication) return
    setProcessingApplicationId(selectedApplication.id)
    createConventionMutation.mutate(selectedApplication.id, {
      onSuccess: () => {
        onCloseConventionModal()
        resetForm()
      },
      onSettled: () => {
        setProcessingApplicationId(null)
      },
    })
  }

  const handleSubmitFileConvention = () => {
    if (!selectedApplication || !uploadedFile) return
    setProcessingApplicationId(selectedApplication.id)
    setTimeout(() => {
      onCloseConventionModal()
      resetForm()
      setProcessingApplicationId(null)
    }, 1000)
  }

  const resetForm = () => {
    form.reset({
      ...form,
      startDate: undefined,
      endDate: undefined
    })
    setUploadedFile(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
    } else {
      alert('Veuillez sélectionner un fichier PDF')
    }
  }

  const handleCloseModal = () => {
    onCloseConventionModal()
    resetForm()
  }

  useEffect(() => {
    if (selectedApplication) {
      form.reset({
        title: `Convention de stage - ${selectedApplication.firstName} ${selectedApplication.lastName}`,
        description: `Stage pour l'offre: ${selectedApplication.offerTitle}`,
        startDate: undefined,
        endDate: undefined,
        companyName: "",
        companyAddress: "",
        supervisorName: "",
        supervisorEmail: "",
        objectives: "",
        weeklyHours: "",
      })
    }
  }, [selectedApplication, form])

  return (
    <Dialog open={isConventionModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="my-6 p-4 h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Convention de Stage</DialogTitle>
          <DialogDescription>
            {selectedApplication && (
              <div className="space-y-1">
                <p className="text-xs">
                  {selectedApplication.firstName} {selectedApplication.lastName} - {selectedApplication.offerTitle}
                </p>
                <div className="text-xs text-muted-foreground">
                  ID: {selectedApplication.id} | Offre: {selectedApplication.offerId} | Étudiant: {selectedApplication.studentId}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="form">Formulaire de convention</TabsTrigger>
            <TabsTrigger value="pdf">Uploader PDF</TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <div className="space-y-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitFormConvention)} className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre de la convention</FormLabel>
                        <FormControl>
                          <Input placeholder="Convention de stage..." {...field} className="text-xs h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l&apos;entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de votre entreprise" {...field} className="text-xs h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de début</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Choisir une date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Choisir une date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supervisorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du superviseur</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du superviseur" {...field} className="text-xs h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supervisorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email du superviseur</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@entreprise.com" {...field} className="text-xs h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weeklyHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heures/semaine</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="35" {...field} className="text-xs h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse de l&apos;entreprise</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Adresse complète de l&apos;entreprise" rows={2} className="text-sm" {...field} />
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
                        <FormLabel>Description du stage</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description détaillée du stage" rows={2} className="text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objectifs du stage</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Objectifs pédagogiques et professionnels" rows={2} className="text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCloseModal}
                    >
                      Annuler
                    </Button>
                    <SubmitButton
                      size="sm"
                      loading={processingApplicationId !== null}
                      loadingText="Enregistrement..."
                      label="Enregistrer"
                    />
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>
          <TabsContent value="pdf">
            <div className="space-y-2">
              <div className="text-center py-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-xs font-medium mb-1">
                    Télécharger votre convention
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Uploadez votre convention PDF
                  </p>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="text-xs h-7"
                    />
                    {uploadedFile && (
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <FileText className="w-3 h-3" />
                        <span className="text-xs">{uploadedFile.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setUploadedFile(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                >
                  Annuler
                </Button>
                <SubmitButton
                  size="sm"
                  onClick={handleSubmitFileConvention}
                  disabled={!uploadedFile || processingApplicationId !== null}
                  loading={processingApplicationId !== null}
                  loadingText="Upload..."
                  label="Télécharger"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 