"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatParticipant } from '@/types/chat-v2';
import { useChatStoreV2 } from '@/stores/chatStoreV2';
import { ParticipantList } from './ParticipantList';
import { ConversationView } from './ConversationView';
import ChatConversationSkeleton from './ChatConversationSkeleton';

interface ChatPanelProps {
  className?: string;
}

const ChatPanel = ({ className }: ChatPanelProps) => {
  const store = useChatStoreV2();
  const [view, setView] = useState<'participants' | 'conversation'>('participants');
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null);
  const [isLoadingConv, setIsLoadingConv] = useState(false);

  const handleSelectParticipant = async (participant: ChatParticipant) => {
    setSelectedParticipant(participant);
    setIsLoadingConv(true);
    try {
      store.setActiveConversation(null);
      await store.getOrCreateConversation(participant.id);
      setView('conversation');
    } catch (e) {
      setView('participants');
    } finally {
      setIsLoadingConv(false);
    }
  };

  return (
    <div className={cn('relative h-full flex flex-col bg-background', className)}>
      {isLoadingConv ? (
        <ChatConversationSkeleton className="h-full" />
      ) : view === 'participants' ? (
        <ParticipantList onSelect={handleSelectParticipant} className="h-full" />
      ) : (
        <ConversationView
          participant={selectedParticipant}
          className="h-full"
          onBack={() => {
            setView('participants');
            setSelectedParticipant(null);
            store.setActiveConversation(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatPanel;
