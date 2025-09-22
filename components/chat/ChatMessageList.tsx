"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Reply, 
  Check, 
  CheckCheck,
  Clock,
  AlertCircle 
} from 'lucide-react';
import { ChatMessage, MessageStatus } from '@/types/chat-v2';
import { useAuth } from '@/hooks/useAuth';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessageListProps {
  messages: ChatMessage[];
  onEditMessage: (message: ChatMessage) => void;
  onDeleteMessage: (messageId: number) => void;
  onReplyMessage: (message: ChatMessage) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  className?: string;
}

export function ChatMessageList({
  messages,
  onEditMessage,
  onDeleteMessage,
  onReplyMessage,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  className,
}: ChatMessageListProps) {
  const { session } = useAuth();
  const currentUserId = Number(session?.user?.id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (autoScroll && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Handle scroll for loading more
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearTop = element.scrollTop < 100;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 100;

    setAutoScroll(isNearBottom);

    if (isNearTop && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  };

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (isYesterday(date)) {
      return `Hier ${format(date, 'HH:mm', { locale: fr })}`;
    } else {
      return format(date, 'dd MMM HH:mm', { locale: fr });
    }
  };

  const getMessageStatusIcon = (status: MessageStatus, isRead?: boolean) => {
    switch (status) {
      case 'SENDING':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'SENT':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'DELIVERED':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'READ':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'FAILED':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  const renderMessageGroup = (messagesGroup: ChatMessage[], date: string) => {
    return (
      <div key={date} className="mb-6">
        {/* Date separator */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-muted px-3 py-1 rounded-full">
            <span className="text-xs text-muted-foreground font-medium">
              {date}
            </span>
          </div>
        </div>

        {/* Messages */}
        {messagesGroup.map((message, index) => {
          const isOwn = message.sender.id === currentUserId;
          const showAvatar = index === 0 || 
            messagesGroup[index - 1]?.sender.id !== message.sender.id;

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2 mb-2",
                isOwn ? "justify-end" : "justify-start"
              )}
            >
              {/* Avatar for other users */}
              {!isOwn && (
                <div className="w-8">
                  {showAvatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/api/avatar/${message.sender.id}`} />
                      <AvatarFallback className="text-xs">
                        {message.sender.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              {/* Message content */}
              <div
                className={cn(
                  "group relative max-w-[70%]",
                  isOwn ? "items-end" : "items-start"
                )}
              >
                {/* Sender name for other users */}
                {!isOwn && showAvatar && (
                  <p className="text-xs text-muted-foreground mb-1 ml-3">
                    {message.sender.fullName}
                  </p>
                )}

                <div className={cn(
                  "relative px-4 py-2 rounded-2xl",
                  isOwn 
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "bg-muted rounded-bl-sm"
                )}>
                  {/* Reply reference */}
                  {message.replyTo && (
                    <div className={cn(
                      "mb-2 p-2 rounded-lg text-xs",
                      isOwn ? "bg-primary-foreground/10" : "bg-background/50"
                    )}>
                      <p className="font-medium mb-0.5">{message.replyTo.senderName}</p>
                      <p className="opacity-75 line-clamp-2">{message.replyTo.content}</p>
                    </div>
                  )}

                  {/* Message text */}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>

                  {/* Edited indicator */}
                  {message.isEdited && (
                    <span className="text-xs opacity-60 ml-2">(modifié)</span>
                  )}

                  {/* Time and status */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs opacity-60">
                      {formatMessageTime(message.createdAt)}
                    </span>
                    {isOwn && getMessageStatusIcon(message.status, message.isRead)}
                  </div>

                  {/* Message actions */}
                  {!message.isDeleted && (
                    <div className={cn(
                      "absolute top-0 -right-8 opacity-0 group-hover:opacity-100 transition-opacity",
                      !isOwn && "-right-8"
                    )}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isOwn ? "end" : "start"}>
                          <DropdownMenuItem onClick={() => onReplyMessage(message)}>
                            <Reply className="h-4 w-4 mr-2" />
                            Répondre
                          </DropdownMenuItem>
                          {isOwn && (
                            <>
                              <DropdownMenuItem onClick={() => onEditMessage(message)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onDeleteMessage(message.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    let dateLabel: string;

    if (isToday(date)) {
      dateLabel = "Aujourd'hui";
    } else if (isYesterday(date)) {
      dateLabel = "Hier";
    } else {
      dateLabel = format(date, 'EEEE d MMMM yyyy', { locale: fr });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <ScrollArea 
      className={cn("flex-1 p-4", className)}
      ref={scrollAreaRef}
      onScroll={handleScroll}
    >
      {/* Load more indicator */}
      {isLoadingMore && (
        <div className="text-center py-2 mb-4">
          <Badge variant="secondary">Chargement...</Badge>
        </div>
      )}

      {/* Messages grouped by date */}
      {Object.entries(groupedMessages).map(([date, messagesGroup]) => 
        renderMessageGroup(messagesGroup, date)
      )}

      {/* Auto-scroll anchor */}
      <div ref={lastMessageRef} />
    </ScrollArea>
  );
}
