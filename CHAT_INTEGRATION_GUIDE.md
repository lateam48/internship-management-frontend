# Guide d'Intégration du Module Chat

## 🎯 Intégration Actuelle

Le module de chat instantané est maintenant **complètement intégré** dans votre application !

### 📍 Où le chat est-il intégré ?

1. **Dans la Navbar** (✅ Implémenté)
   - Un bouton de chat apparaît automatiquement dans la navbar
   - Visible uniquement pour les rôles **STUDENT** et **COMPANY**
   - Ouvre un panneau latéral (Sheet) avec le module de chat complet
   - Badge de notification pour les messages non lus

2. **Provider Global** (✅ Implémenté)
   - `ChatProvider` dans `app/layout.tsx`
   - Initialise automatiquement le chat pour les utilisateurs éligibles
   - Gère la connexion WebSocket et l'état global

### 🚀 Comment ça marche ?

#### Pour les Étudiants (STUDENT)
- Le bouton de chat apparaît dans la navbar
- Peuvent discuter avec les entreprises auxquelles ils ont postulé
- Messages en temps réel avec indicateur de frappe

#### Pour les Entreprises (COMPANY)
- Le bouton de chat apparaît dans la navbar
- Peuvent discuter avec les étudiants qui ont postulé à leurs offres
- Gestion complète des conversations

#### Pour les autres rôles (ADMIN, TEACHER)
- Pas d'accès au chat (bouton masqué automatiquement)

## 🛠️ Configuration

### Variables d'environnement

Assurez-vous que ces variables sont définies dans `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=http://localhost:8080
```

### Dépendances requises

```bash
npm install @stomp/stompjs sockjs-client
npm install date-fns framer-motion
```

## 📦 Structure des fichiers

```
components/
├── chat/                    # Tous les composants du chat
│   ├── ChatButton.tsx      # Bouton intégré dans la navbar
│   ├── ChatModule.tsx      # Module principal
│   └── ...                 # Autres composants
├── layout/
│   └── navbar.tsx          # Navbar modifiée avec le chat

providers/
└── ChatProvider.tsx        # Provider pour initialisation

app/
└── layout.tsx              # Layout avec ChatProvider
```

## 🎨 Personnalisation

### Changer la position du bouton

Dans `components/layout/navbar.tsx`, le bouton est actuellement placé avant les notifications :

```tsx
{showChatButton && (
  <ChatButton 
    variant="icon"  // ou "text" ou "both"
    size="md"       // ou "sm" ou "lg"
  />
)}
```

### Utiliser le widget flottant à la place

Si vous préférez un widget flottant, ajoutez dans votre layout :

```tsx
import { ChatFloatingWidget } from '@/components/chat/ChatFloatingWidget';

// Dans le layout
<ChatFloatingWidget />
```

### Modifier les règles d'accès

Dans `components/layout/navbar.tsx` :

```tsx
// Ligne 27 - Modifier les rôles autorisés
const showChatButton = userRole === 'STUDENT' || userRole === 'COMPANY';
```

## 🔧 Dépannage

### Le bouton de chat n'apparaît pas
- Vérifiez que l'utilisateur est connecté
- Vérifiez que le rôle est STUDENT ou COMPANY
- Vérifiez la console pour les erreurs

### WebSocket ne se connecte pas
- Vérifiez que le backend est lancé
- Vérifiez les URLs dans `.env.local`
- Vérifiez les CORS sur le backend

### Messages non reçus
- Vérifiez la connexion WebSocket
- Vérifiez les permissions utilisateur
- Vérifiez que les participants sont éligibles

## 📝 Utilisation

### Pour les développeurs

Le chat est automatiquement disponible, pas besoin d'importer quoi que ce soit !

Si vous voulez accéder programmatiquement au chat :

```tsx
import { useChat } from '@/components/chat';

function MyComponent() {
  const { 
    conversations, 
    messages, 
    sendMessage,
    totalUnreadCount 
  } = useChat();
  
  // Utiliser les fonctions du chat
}
```

### Pour les utilisateurs finaux

1. **Cliquez sur l'icône de message** dans la barre de navigation
2. **Sélectionnez une conversation** ou créez-en une nouvelle
3. **Envoyez des messages** en temps réel
4. **Modifiez ou supprimez** vos messages (dans les 24h)
5. **Recevez des notifications** pour les nouveaux messages

## 🚦 Statut de l'intégration

- ✅ **Backend** : Module complet avec WebSocket
- ✅ **Frontend** : Composants UI avec shadcn
- ✅ **Intégration Navbar** : Bouton de chat pour STUDENT/COMPANY
- ✅ **Provider Global** : Initialisation automatique
- ✅ **WebSocket** : Connexion temps réel
- ✅ **Permissions** : Règles métier respectées
- ✅ **Responsive** : Adaptatif mobile/desktop
- ✅ **Notifications** : Badge de non-lus

## 📚 Documentation complète

- Backend : `CHAT_MODULE_README.md`
- Frontend : `CHAT_MODULE_FRONTEND_README.md`
- Ce guide : `CHAT_INTEGRATION_GUIDE.md`

## 🎉 C'est prêt !

Le module de chat est maintenant **pleinement opérationnel** dans votre application. Les étudiants et entreprises peuvent commencer à discuter immédiatement !
