"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { ChatModule } from './ChatModule';
import { useTotalUnreadCount } from '@/hooks/useChatV2';

interface ChatButtonProps {
  variant?: 'icon' | 'text' | 'both';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChatButton({ 
  variant = 'both',
  size = 'md',
  className 
}: ChatButtonProps) {
  const totalUnreadCount = useTotalUnreadCount();

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-9',
    lg: 'h-10 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
          className={cn(
            "relative",
            sizeClasses[size],
            variant === 'icon' && 'w-9 px-0',
            className
          )}
        >
          <MessageCircle className={cn(
            iconSizes[size],
            variant === 'both' && 'mr-2'
          )} />
          {variant !== 'icon' && (
            <span>Messages</span>
          )}
          {totalUnreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className={cn(
                "absolute -top-1 -right-1",
                size === 'sm' && "h-4 min-w-[16px] px-1 text-xs",
                size === 'md' && "h-5 min-w-[20px] px-1.5 text-xs",
                size === 'lg' && "h-6 min-w-[24px] px-1.5"
              )}
            >
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
            {totalUnreadCount > 0 && (
              <Badge variant="secondary">
                {totalUnreadCount} non lu{totalUnreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-80px)]">
          <ChatModule className="h-full border-0 rounded-none shadow-none" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
