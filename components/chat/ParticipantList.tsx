"use client";

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Users } from 'lucide-react';
import { ChatParticipant } from '@/types/chat-v2';
import { useEligibleParticipants } from '@/hooks/useChatV2';

interface ParticipantListProps {
  onSelect: (participant: ChatParticipant) => void;
  className?: string;
}

export function ParticipantList({ onSelect, className }: ParticipantListProps) {
  const { participants, refresh } = useEligibleParticipants();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = participants.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  const getInitials = (name: string): string =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-base font-semibold mb-3">Participants</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {searchQuery ? 'Aucun résultat' : 'Aucun participant disponible'}
              </p>
              <Button variant="link" size="sm" className="mt-1" onClick={refresh}>
                Actualiser
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className={cn(
                    'w-full p-3 rounded-lg text-left transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/api/avatar/${p.id}`} />
                        <AvatarFallback className="text-sm">{getInitials(p.fullName)}</AvatarFallback>
                      </Avatar>
                      {p.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm truncate">{p.fullName}</p>
                        {p.role && (
                          <Badge variant="secondary" className="text-xs">{p.role}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                    </div>

                    {/* Status */}
                    {p.isOnline && (
                      <Badge variant="outline" className="text-xs">En ligne</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
