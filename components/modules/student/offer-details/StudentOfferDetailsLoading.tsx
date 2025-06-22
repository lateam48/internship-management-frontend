"use client"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentOfferDetailsLoading() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-32 w-full mb-2" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full mb-2" />
          <Skeleton className="h-24 w-full mb-2" />
        </div>
      </div>
    </div>
  )
} 