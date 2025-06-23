"use client"

import { useSectors } from "@/hooks/useSectors"
import { useInternshipOffer } from "@/hooks/useInternshipOffer"
import { CreateOfferHeader } from "./CreateOfferHeader"
import { CreateOfferForm } from "./CreateOfferForm"
import { CreateOfferTips } from "./CreateOfferTips"
import { UserStore, useUserStore } from "@/stores/userStore"

export function CreateOffer() {
    const user = useUserStore((state: UserStore) => state.user);
    const { getSectors } = useSectors();
    const { createOffer } = useInternshipOffer({});

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <CreateOfferHeader />
      <CreateOfferForm
        getSectors={getSectors}
        createOffer={createOffer}
        user={user}
      />
      <CreateOfferTips />
    </div>
  )
}
