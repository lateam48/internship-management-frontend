"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatConversationSkeletonProps {
  className?: string;
}

export function ChatConversationSkeleton({ className }: ChatConversationSkeletonProps) {
  return (
    <div className={cn('flex h-full flex-col bg-background', className)}>
      {/* Header skeleton */}
      <div className="h-14 border-b bg-background px-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Messages area skeleton */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full overflow-auto space-y-3 pr-1">
          {/* Simulated incoming/outgoing bubbles */}
          <div className="flex">
            <Skeleton className="h-10 w-2/3 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-3/4 rounded-2xl" />
          </div>
          <div className="flex">
            <Skeleton className="h-6 w-1/2 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-6 w-1/3 rounded-2xl" />
          </div>
          <div className="flex">
            <Skeleton className="h-10 w-1/2 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-2/3 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t bg-background p-4">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export default ChatConversationSkeleton;
