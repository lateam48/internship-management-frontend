# Module Chat Frontend - Documentation

## Vue d'ensemble

Module de chat instantané moderne et modulaire pour Next.js/React utilisant shadcn/ui. Ce module est conçu pour être réutilisable et s'intègre parfaitement avec le backend Spring Boot.

## Architecture

### Structure du module

```
components/chat/
├── ChatModule.tsx           # Composant principal du chat
├── ChatWidget.tsx           # Widget flottant de chat
├── ChatButton.tsx           # Bouton pour sidebar/navbar
├── ChatConversationList.tsx # Liste des conversations
├── ChatMessageList.tsx      # Liste des messages
├── ChatMessageInput.tsx     # Zone de saisie des messages
├── ChatHeader.tsx           # En-tête de conversation
├── ChatNewConversation.tsx  # Dialog nouvelle conversation
└── index.ts                 # Exports centralisés

lib/
├── chat-websocket.ts        # Service WebSocket/STOMP

services/
├── chatServiceV2.ts         # Service API REST

stores/
├── chatStoreV2.ts          # Store Zustand

hooks/
├── useChatV2.ts            # Hooks personnalisés

types/
├── chat-v2.ts              # Types TypeScript
```

## Fonctionnalités

### 🎨 Interface Utilisateur
- ✅ Design moderne avec shadcn/ui
- ✅ Mode responsive (desktop/mobile)
- ✅ Mode sombre/clair
- ✅ Animations fluides avec Framer Motion
- ✅ Indicateurs visuels (en ligne, frappe, lu)

### 💬 Messagerie
- ✅ Envoi/réception en temps réel
- ✅ Modification de messages
- ✅ Suppression de messages
- ✅ Réponse à un message
- ✅ Indicateur de frappe
- ✅ Accusés de lecture
- ✅ Compteur de non-lus

### 🔄 Temps Réel
- ✅ WebSocket avec STOMP
- ✅ Reconnexion automatique
- ✅ Statut de connexion
- ✅ Présence en ligne/hors ligne
- ✅ Synchronisation instantanée

### 📱 Responsive
- ✅ Layout adaptatif
- ✅ Navigation mobile optimisée
- ✅ Gestes tactiles supportés

## Installation

### 1. Prérequis

```bash
npm install @stomp/stompjs sockjs-client
npm install date-fns framer-motion
npm install zustand immer
```

### 2. Configuration

Créez ou mettez à jour `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=http://localhost:8080
```

### 3. Intégration

#### Option A: Page dédiée

```tsx
// app/chat/page.tsx
import { ChatModule } from '@/components/chat';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-6">
      <ChatModule className="h-[600px]" />
    </div>
  );
}
```

#### Option B: Widget flottant

```tsx
// app/layout.tsx
import { ChatWidget } from '@/components/chat';

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <ChatWidget position="bottom-right" />
    </div>
  );
}
```

#### Option C: Bouton dans la navbar

```tsx
// components/navbar.tsx
import { ChatButton } from '@/components/chat';

export function Navbar() {
  return (
    <nav>
      <ChatButton variant="both" size="md" />
    </nav>
  );
}
```

## Utilisation

### Hooks disponibles

```tsx
import { 
  useChat,
  useTypingIndicator,
  useConversation,
  useUnreadBadge,
  useEligibleParticipants 
} from '@/components/chat';

function MyComponent() {
  // Hook principal
  const {
    conversations,
    messages,
    sendMessage,
    deleteMessage,
    markAsRead,
  } = useChat();

  // Indicateur de frappe
  const { sendTyping } = useTypingIndicator(recipientId);

  // Badge de non-lus
  const { unreadCount } = useUnreadBadge();

  // Participants éligibles
  const { participants } = useEligibleParticipants();
}
```

### Personnalisation

#### Thème et styles

```tsx
<ChatModule 
  className="custom-class"
  compactMode={true}
/>
```

#### Configuration WebSocket

```tsx
// lib/chat-websocket.ts
const config: ChatConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  enableTypingIndicator: true,
  enablePresence: true,
  enableReadReceipts: true,
  messagePageSize: 50,
  reconnectDelay: 5000,
  maxReconnectAttempts: 5,
};
```

## Composants

### ChatModule
Composant principal complet avec liste et conversation.

```tsx
<ChatModule 
  className="h-[600px]"
  defaultView="list"
  compactMode={false}
/>
```

### ChatWidget
Widget flottant pour intégration globale.

```tsx
<ChatWidget 
  position="bottom-right"
  defaultOpen={false}
/>
```

### ChatButton
Bouton pour sidebar/navbar avec badge.

```tsx
<ChatButton 
  variant="both" // 'icon' | 'text' | 'both'
  size="md"      // 'sm' | 'md' | 'lg'
/>
```

## État Global

Le module utilise Zustand pour la gestion d'état:

```tsx
// Accès direct au store
import { useChatStoreV2 } from '@/stores/chatStoreV2';

const store = useChatStoreV2();
const conversations = store.conversations;
const messages = store.messages[conversationId];
```

## Sécurité

- ✅ Authentification par token JWT
- ✅ Validation des permissions côté serveur
- ✅ Sanitization des messages
- ✅ Protection XSS
- ✅ Rate limiting côté serveur

## Performance

- ✅ Pagination des messages
- ✅ Lazy loading des conversations
- ✅ Optimisation des re-renders
- ✅ Cache local avec persistance
- ✅ Debouncing des indicateurs de frappe

## Accessibilité

- ✅ Navigation au clavier
- ✅ Lecteurs d'écran supportés
- ✅ Contraste WCAG AA
- ✅ Focus visible
- ✅ Annonces ARIA

## Internationalisation

Le module utilise `date-fns` avec locale française:

```tsx
import { fr } from 'date-fns/locale';

formatDistanceToNow(date, { locale: fr });
```

## Dépannage

### WebSocket ne se connecte pas
- Vérifiez l'URL dans `.env.local`
- Vérifiez que le backend est lancé
- Vérifiez les CORS

### Messages non reçus
- Vérifiez le token d'authentification
- Vérifiez la console pour les erreurs
- Vérifiez les permissions utilisateur

### UI non responsive
- Vérifiez les classes Tailwind
- Vérifiez les breakpoints
- Testez sur différents appareils

## Exemples d'intégration

### Interface Étudiant
```tsx
// app/(authenticated)/student/chat/page.tsx
<ChatModule className="h-[calc(100vh-200px)]" />
```

### Interface Entreprise
```tsx
// app/(authenticated)/company/chat/page.tsx
<ChatModule className="h-[calc(100vh-300px)]" />
```

### Dashboard avec widget
```tsx
// app/(authenticated)/dashboard/page.tsx
<ChatWidget position="bottom-right" />
```

## Contribution

Pour étendre le module:

1. Ajoutez de nouveaux composants dans `components/chat/`
2. Étendez les types dans `types/chat-v2.ts`
3. Ajoutez des hooks dans `hooks/useChatV2.ts`
4. Mettez à jour les exports dans `components/chat/index.ts`

## Support

Pour toute question, consultez:
- La documentation backend: `CHAT_MODULE_README.md`
- Les types TypeScript: `types/chat-v2.ts`
- Les composants shadcn/ui: https://ui.shadcn.com
