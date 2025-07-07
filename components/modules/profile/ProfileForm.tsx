"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { SubmitButton } from "@/components/global/submit-button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useSectors } from "@/hooks/useSectors";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sector } from "@/types/sector";
import { useUpdateStaffMe } from "@/hooks/useStaff";
import { toast } from "sonner";
import { queryClient } from "@/providers";

export default function ProfileForm({ user }: Readonly<{ user: User }>) {
  const { getSectors } = useSectors();
  const sectors: Sector[] = getSectors.data ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    sector?: string;
  } | null>(null);

  const form = useForm<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    sector?: string;
  }>({
    defaultValues: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      sector: user.sector?.name ?? "",
    },
    mode: "onChange",
  });

  const updateStaffMe = useUpdateStaffMe();

  console.log("Sectors:", sectors);
  console.log("User sector:", user.sector?.name);

  function handleDialogConfirm() {
    if (pendingValues) {
      const selectedSector = sectors.find(s => s.name === pendingValues.sector);
      updateStaffMe.mutate(
        {
          username: pendingValues.username,
          firstName: pendingValues.firstName,
          lastName: pendingValues.lastName,
          sectorId: selectedSector ? selectedSector.id : user.sector?.id ?? 0,
        },
        {
          onSuccess: () => {
            toast.success("Profil mis à jour avec succès");
            setPendingValues(null);
            setDialogOpen(false);
            form.reset(pendingValues);
            queryClient.invalidateQueries({ queryKey: ['me'] });
          },
          onError: (error: unknown) => {
            let message = "Une erreur est survenue.";
            if (typeof error === "object" && error !== null) {
              const err = error as { response?: { data?: { message?: string } }, message?: string };
              message = err.response?.data?.message ?? err.message ?? message;
            }
            toast.error("Erreur lors de la mise à jour du profil", { description: message });
          },
        }
      );
    }
  }

  function onSubmit(values: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    sector?: string;
  }) {
    setPendingValues(values);
    setDialogOpen(true);
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d&apos;utilisateur</FormLabel>
                <FormControl>
                  <Input {...field} className="mt-1" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="mt-1" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} className="mt-1" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} className="mt-1" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="mt-1" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 text-sm">
                  Secteur actuel: <span className="font-semibold">{field.value ?? "Aucun"}</span>
                </div>
                <FormControl className="w-full">
                  <Select value={field.value} onValueChange={field.onChange} disabled={getSectors.isLoading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Sélectionner un secteur (${field.value ?? "Aucun"})`} className="w-full" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}
            className="w-full">
            {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </form>
      </Form>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer les modifications</DialogTitle>
          </DialogHeader>
          <div>Voulez-vous vraiment enregistrer les modifications de votre profil ?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); form.reset(); }} type="button">
              Annuler
            </Button>
            <SubmitButton onClick={handleDialogConfirm} btnType="button" label="Confirmer" loading={form.formState.isSubmitting} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 