"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { ChatWidget } from './ChatWidget';

/**
 * Floating Chat Widget
 * Shows the chat widget only for STUDENT and COMPANY roles
 */
export function ChatFloatingWidget() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  
  // Only show for STUDENT and COMPANY roles
  if (userRole !== 'STUDENT' && userRole !== 'COMPANY') {
    return null;
  }

  return <ChatWidget position="bottom-right" />;
}
