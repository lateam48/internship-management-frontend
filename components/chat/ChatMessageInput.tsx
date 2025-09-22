"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Paperclip, 
  Smile, 
  X,
  Edit2,
  Reply
} from 'lucide-react';
import { ChatMessage } from '@/types/chat-v2';
import { useTypingIndicator } from '@/hooks/useChatV2';

interface ChatMessageInputProps {
  onSendMessage: (content: string) => void;
  onCancelEdit?: () => void;
  editingMessage?: ChatMessage | null;
  replyingTo?: ChatMessage | null;
  onCancelReply?: () => void;
  recipientId?: number | null;
  disabled?: boolean;
  className?: string;
}

export function ChatMessageInput({
  onSendMessage,
  onCancelEdit,
  editingMessage,
  replyingTo,
  onCancelReply,
  recipientId,
  disabled = false,
  className,
}: ChatMessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendTyping } = useTypingIndicator(recipientId || null);

  // Update message when editing
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  // Focus on reply
  useEffect(() => {
    if (replyingTo) {
      textareaRef.current?.focus();
    }
  }, [replyingTo]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
      
      // Cancel edit/reply mode
      if (editingMessage && onCancelEdit) {
        onCancelEdit();
      }
      if (replyingTo && onCancelReply) {
        onCancelReply();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    // Send typing indicator
    if (newValue.length > 0) {
      sendTyping(true);
    } else {
      sendTyping(false);
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className={cn("border-t bg-background", className)}>
      {/* Edit/Reply indicator */}
      {(editingMessage || replyingTo) && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 flex-1">
              {editingMessage ? (
                <>
                  <Edit2 className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-primary">
                      Modification du message
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {editingMessage.content}
                    </p>
                  </div>
                </>
              ) : replyingTo ? (
                <>
                  <Reply className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-primary">
                      Réponse à {replyingTo.sender.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {replyingTo.content}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={editingMessage ? onCancelEdit : onCancelReply}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          {/* Message input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={
                disabled 
                  ? "Sélectionnez une conversation..." 
                  : "Écrivez votre message..."
              }
              disabled={disabled || isSending}
              className={cn(
                "min-h-[40px] max-h-[120px] resize-none",
                "pr-10 py-2.5",
                "placeholder:text-muted-foreground",
                "focus-visible:ring-1"
              )}
              rows={1}
            />
            
            {/* Emoji button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 bottom-1 h-7 w-7 p-0"
              disabled={disabled}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled || isSending}
            size="sm"
            className="h-9 px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Hints */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            Appuyez sur <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Entrée</kbd> pour envoyer
          </p>
          {message.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {message.length} / 1000
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
