import { useMutation, useQuery } from "@tanstack/react-query"

import { InternshipOffersCacheKeys } from "@/services/const";
import { queryClient } from "@/providers";
import { toast } from "@/hooks/use-toast";

import { internshipOfferService } from '../services/offerService';
import { CreateInternshipOfferRequestDTO, GetInternshipOfferResponseDTO } from '../types/index';

export const useInternshipOffer = ({ internshipOfferId }: {
  internshipOfferId?: GetInternshipOfferResponseDTO['id']
}) => {
  const createOffer = useMutation({
    mutationFn: ({ data }: { data: CreateInternshipOfferRequestDTO }) =>
      internshipOfferService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      })
      toast({
        title: "Offre créée",
        description: "L'offre de stage a été publiée avec succès.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de créer l'offre",
        variant: "destructive",
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
      toast({
        title: "Offre mise à jour",
        description: "L'offre de stage a été mise à jour avec succès.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour l'offre",
        variant: "destructive",
      })
    }
  })

  const activateInternshipOffer = useMutation({
    mutationFn: internshipOfferService.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      }),
        queryClient.invalidateQueries({
          queryKey: [InternshipOffersCacheKeys.InternshipOffer]
        })
      toast({
        title: "Offre activée",
        description: "L'offre de stage a été activé avec succès.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible d'activer l'offre",
        variant: "destructive",
      })
    }
  })

  const inactivateInternshipOffer = useMutation({
    mutationFn: internshipOfferService.inactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      }),
        queryClient.invalidateQueries({
          queryKey: [InternshipOffersCacheKeys.InternshipOffer]
        })
      toast({
        title: "Offre inactive",
        description: "L'offre de stage a été desactivée avec succès.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de désactiver l'offre",
        variant: "destructive",
      })
    }
  })

  const completeInternshipOffer = useMutation({
    mutationFn: internshipOfferService.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [InternshipOffersCacheKeys.InternshipOffers]
      }),
        queryClient.invalidateQueries({
          queryKey: [InternshipOffersCacheKeys.InternshipOffer]
        })
      toast({
        title: "Offre complète",
        description: "L'offre de stage a été complété avec succès.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de compléter l'offre",
        variant: "destructive",
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