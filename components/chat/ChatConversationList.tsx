"use client";

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, MessageCircle, Plus } from 'lucide-react';
import { ChatConversation, ChatParticipant } from '@/types/chat-v2';
import { useChatConversations, useOnlineUsers } from '@/stores/chatStoreV2';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatConversationListProps {
  activeConversationId: number | null;
  onSelectConversation: (conversationId: number) => void;
  onNewConversation: () => void;
  className?: string;
}

export function ChatConversationList({
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  className,
}: ChatConversationListProps) {
  const conversations = useChatConversations();
  const onlineUsers = useOnlineUsers();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.participants.some(p => 
        p.fullName.toLowerCase().includes(searchLower) ||
        p.username.toLowerCase().includes(searchLower)
      ) ||
      conv.lastMessagePreview?.toLowerCase().includes(searchLower)
    );
  });

  const getOtherParticipant = (conversation: ChatConversation): ChatParticipant | undefined => {
    // In a direct conversation, get the other participant
    return conversation.participants[0]; // Simplified - should filter out current user
  };

  const getParticipantInitials = (participant: ChatParticipant | undefined): string => {
    if (!participant) return '?';
    const names = participant.fullName.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatLastMessageTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: fr 
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={cn("flex flex-col h-full border-r bg-background", className)}>
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </h2>
          <Button
            onClick={onNewConversation}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Aucune conversation</p>
              <Button
                onClick={onNewConversation}
                variant="link"
                size="sm"
                className="mt-2"
              >
                Démarrer une conversation
              </Button>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const isOnline = otherParticipant && onlineUsers.has(otherParticipant.id);
              const isActive = conversation.id === activeConversationId;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={cn(
                    "w-full p-3 rounded-lg mb-1 text-left transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/api/avatar/${otherParticipant?.id}`} />
                        <AvatarFallback className="text-xs">
                          {getParticipantInitials(otherParticipant)}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">
                          {otherParticipant?.fullName || 'Utilisateur'}
                        </p>
                        {conversation.lastMessageAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatLastMessageTime(conversation.lastMessageAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate pr-2">
                          {conversation.lastMessagePreview || 'Aucun message'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge 
                            variant="default" 
                            className="h-5 min-w-[20px] px-1.5 text-xs"
                          >
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
