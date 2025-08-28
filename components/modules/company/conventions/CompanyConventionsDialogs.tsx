"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Upload, X } from "lucide-react"
import { SubmitButton } from "@/components/global/submit-button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import type { UpdateConventionByCompanyMutation, UploadSignedPdfMutation } from "@/types";
import { ConventionResponseDTO, createConventionFormSchema, CreateConventionFormSchema } from "@/types"

interface CompanyConventionsDialogsProps {
    editingConvention: ConventionResponseDTO | null
    onCloseEdit: () => void
    updateConventionMutation: UpdateConventionByCompanyMutation
    uploadingConvention: ConventionResponseDTO | null
    onCloseUpload: () => void
    uploadPdfMutation: UploadSignedPdfMutation
  }

export function CompanyConventionsDialogs({
  editingConvention,
  onCloseEdit,
  updateConventionMutation,
  uploadingConvention,
  onCloseUpload,
  uploadPdfMutation,
}: Readonly<CompanyConventionsDialogsProps>) {
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

  useEffect(() => {
    if (editingConvention) {
      form.reset({
        title: editingConvention.title,
        description: editingConvention.description,
        startDate: new Date(editingConvention.startDate),
        endDate: new Date(editingConvention.endDate),
        companyName: editingConvention.companyName,
        companyAddress: "",
        supervisorName: "",
        supervisorEmail: "",
        objectives: "",
        weeklyHours: "",
      })
    }
  }, [editingConvention, form])

  const handleSubmitEdit = (data: CreateConventionFormSchema) => {
    if (!editingConvention) return
    updateConventionMutation.mutate({
      id: editingConvention.id,
      companyId: editingConvention.companyId,
      data: {
        id: editingConvention.id,
        title: data.title ?? "",
        description: data.description ?? "",
        location: editingConvention.location ?? "",
        skills: editingConvention.skills ?? [],
        length: Number(editingConvention.length) || 0,
        companyId: editingConvention.companyId,
        companyName: data.companyName ?? "",
        companyAddress: data.companyAddress ?? "",
        studentId: editingConvention.studentId,
        teacherId: 0,
        startDate: data.startDate ? data.startDate.toISOString().slice(0, 10) : "",
        endDate: data.endDate ? data.endDate.toISOString().slice(0, 10) : "",
        supervisorName: data.supervisorName ?? "",
        supervisorEmail: data.supervisorEmail ?? "",
        objectives: data.objectives ?? "",
        weeklyHours: Number(data.weeklyHours) || 0,
        offerId: 0,
        applicationId: editingConvention.applicationId,
        companyInfoId: 0
      },
    })
    onCloseEdit()
  }

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
    } else {
      alert('Veuillez sélectionner un fichier PDF')
    }
  }
  const handleSubmitUpload = () => {
    if (!uploadingConvention || !uploadedFile) return
    uploadPdfMutation.mutate({ id: uploadingConvention.id, file: uploadedFile })
    setUploadedFile(null)
    onCloseUpload()
  }

  return (
    <>
      <Dialog open={!!editingConvention} onOpenChange={onCloseEdit}>
        <DialogContent className="my-6 p-4 h-full max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg">Modifier la convention</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitEdit)} className="space-y-2">
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
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{"Nom de l'entreprise"}</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de votre entreprise" {...field} className="text-xs h-7" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{"Adresse de l'entreprise"}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Adresse complète de l'entreprise" rows={2} className="text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="supervisorName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
                      <FormLabel>Email du superviseur</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@entreprise.com" {...field} className="text-xs h-7" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={onCloseEdit}>
                  Annuler
                </Button>
                <SubmitButton
                  size="sm"
                  loading={updateConventionMutation.isPending}
                  loadingText="Enregistrement..."
                  label="Enregistrer"
                />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!uploadingConvention} onOpenChange={onCloseUpload}>
        <DialogContent className="my-6 p-4 h-full max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg">Uploader la convention signée</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="pdf">
            <TabsList className="mb-4">
              <TabsTrigger value="pdf">Uploader PDF</TabsTrigger>
            </TabsList>
            <TabsContent value="pdf">
              <div className="space-y-2">
                <div className="text-center py-4">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-xs font-medium mb-1">Télécharger votre convention</h3>
                  <p className="text-xs text-gray-500 mb-2">Uploadez votre convention PDF</p>
                  <div className="space-y-2">
                    <Input type="file" accept=".pdf" onChange={handleFileChange} className="text-xs h-7" />
                    {uploadedFile && (
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <span className="text-xs">{uploadedFile.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => setUploadedFile(null)} className="h-6 w-6 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={onCloseUpload}>Annuler</Button>
                  <SubmitButton
                    size="sm"
                    onClick={handleSubmitUpload}
                    disabled={!uploadedFile || uploadPdfMutation.isPending}
                    loading={uploadPdfMutation.isPending}
                    loadingText="Upload..."
                    label="Télécharger"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}