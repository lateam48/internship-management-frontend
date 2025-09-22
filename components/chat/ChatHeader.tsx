"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Search,
  Archive,
  Trash2,
  Bell,
  BellOff,
  X
} from 'lucide-react';
import { ChatConversation, TypingIndicator } from '@/types/chat-v2';
import { useOnlineUsers } from '@/stores/chatStoreV2';

interface ChatHeaderProps {
  conversation: ChatConversation | null;
  typingUsers: TypingIndicator[];
  onClose?: () => void;
  onInfo?: () => void;
  className?: string;
}

export function ChatHeader({
  conversation,
  typingUsers,
  onClose,
  onInfo,
  className,
}: ChatHeaderProps) {
  const onlineUsers = useOnlineUsers();

  if (!conversation) {
    return (
      <div className={cn("h-16 border-b bg-background flex items-center justify-center", className)}>
        <p className="text-muted-foreground">Sélectionnez une conversation</p>
      </div>
    );
  }

  // Get the other participant (simplified for direct messages)
  const otherParticipant = conversation.participants[0];
  const isOnline = otherParticipant && onlineUsers.has(otherParticipant.id);
  
  // Check if the other user is typing
  const isTyping = typingUsers.some(t => t.senderId === otherParticipant?.id);

  const getParticipantInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn("h-16 border-b bg-background", className)}>
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Mobile close button */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}

          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/api/avatar/${otherParticipant?.id}`} />
              <AvatarFallback className="text-sm">
                {otherParticipant ? getParticipantInitials(otherParticipant.fullName) : '?'}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>

          {/* User info */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">
                {otherParticipant?.fullName || 'Utilisateur'}
              </h3>
              {otherParticipant?.role && (
                <Badge variant="secondary" className="text-xs">
                  {otherParticipant.role}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isTyping ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">En train d'écrire</span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </span>
              ) : isOnline ? (
                'En ligne'
              ) : (
                'Hors ligne'
              )}
            </p>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-1">
          {/* Call buttons (disabled for now) */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled
          >
            <Video className="h-4 w-4" />
          </Button>

          {/* Search button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Info button */}
          {onInfo && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onInfo}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Bell className="h-4 w-4 mr-2" />
                Activer les notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellOff className="h-4 w-4 mr-2" />
                Désactiver les notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archiver la conversation
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer la conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
