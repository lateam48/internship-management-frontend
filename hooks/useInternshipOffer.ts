import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation";

import { InternshipOffersCacheKeys } from "@/services/const";
import { queryClient } from "@/providers";

import { internshipOfferService } from '../services/offerService';
import { CreateInternshipOfferRequestDTO, GetInternshipOfferResponseDTO } from '../types/index';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
export const useInternshipOffer = ({ internshipOfferId }: {
  internshipOfferId?: GetInternshipOfferResponseDTO['id']
}) => {
  const router = useRouter()
  const createOffer = useMutation({
    mutationFn: ({ data }: { data: CreateInternshipOfferRequestDTO }) =>
      internshipOfferService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      })
      toast.success("Offre créée", {
        description: "L'offre de stage a été publiée avec succès.",
      })
      router.push("/dashboard/offers")
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message ?? "Impossible de créer l'offre",
      })
    }
  })

  const getInternshipOffer = useQuery({
    queryKey: [InternshipOffersCacheKeys.InternshipOffers, internshipOfferId],
    queryFn: () =>
      internshipOfferService.getById(internshipOfferId as GetInternshipOfferResponseDTO['id']),
    enabled: !!internshipOfferId
  })

  const updateInternshipOffer = useMutation({
    mutationFn: ({ id, data }: { id: GetInternshipOfferResponseDTO['id'], data: CreateInternshipOfferRequestDTO }) =>
      internshipOfferService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      })
      toast.success("Offre mise à jour", {
        description: "L'offre de stage a été mise à jour avec succès.",
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message ?? "Impossible de mettre à jour l'offre",
      })
    }
  })

  const activateInternshipOffer = useMutation({
    mutationFn: internshipOfferService.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      })
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffer]
      })
      toast.success("Offre activée", {
        description: "L'offre de stage a été activé avec succès.",
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message ?? "Impossible d'activer l'offre",
      })
    }
  })

  const inactivateInternshipOffer = useMutation({
    mutationFn: internshipOfferService.inactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      })
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffer]
      })
      toast.success("Offre inactive", {
        description: "L'offre de stage a été desactivée avec succès.",
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message || "Impossible de désactiver l'offre",
      })
    }
  })

  const completeInternshipOffer = useMutation({
    mutationFn: internshipOfferService.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      })
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffer]
      })
      toast.success("Offre complète", {
        description: "L'offre de stage a été complété avec succès.",
      })
    },
    onError: (error: ApiError) => {
      toast.error("Erreur", {
        description: error.response?.data?.message || "Impossible de compléter l'offre",
      })
    }
  })

  return {
    completeInternshipOffer,
    inactivateInternshipOffer,
    activateInternshipOffer,
    updateInternshipOffer,
    getInternshipOffer,
    createOffer
  }
}