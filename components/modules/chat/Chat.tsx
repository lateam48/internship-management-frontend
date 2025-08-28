'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useChat } from '@/hooks/useChat'
import { ChatInterface } from './ChatInterface'
import { CHAT_ROLES, ChatRole, roleLabels } from '@/lib/chat'

export function Chat() {
  const { data: session } = useSession()
  const { setCurrentUserId } = useChatStore()

  useEffect(() => {
    const currentUserId = session?.user?.id ? parseInt(session.user.id) : undefined
    if (currentUserId !== undefined) {
      setCurrentUserId(currentUserId)
    }
  }, [session?.user?.id, setCurrentUserId])

  
  const {
    participants,
    messages,
    unreadCount,
    isSending,
    isDeletingAll,
    addReaction,
    deleteMessage,
    deleteAllMessages,
    selectParticipant,
    selectedParticipant: hookSelectedParticipant,
    sendMessage
  } = useChat()

  const currentUserId = session?.user?.id ? parseInt(session.user.id) : undefined;
  const userRole = session?.user?.role?.toUpperCase();

  if (!userRole || !CHAT_ROLES.includes(userRole as ChatRole)) {
    return <div className="text-center text-muted-foreground py-8">Chat non disponible pour ce rôle.</div>;
  }

  const participantRoles = CHAT_ROLES.filter(role => role !== userRole);
  const participantRole = participantRoles[0];

  const title = `Chat avec les ${roleLabels[participantRole] || (participantRole as string).toLowerCase()}`;

  return <ChatInterface {...{
    participants,
    messages,
    selectedParticipant: hookSelectedParticipant,
    onSelectParticipant: selectParticipant,
    onSendMessage: sendMessage,
    onAddReaction: (messageId, emoji) => addReaction(String(messageId), emoji),
    onDeleteMessage: (messageId) => deleteMessage(String(messageId)),
    onDeleteAllMessages: deleteAllMessages,
    isSending,
    isDeletingAll,
    currentUserId,
    unreadCount,
    title,
    participantRole
  }} />
}
