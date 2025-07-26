# Notifications WebSocket - Documentation

## Fonctionnalités implémentées

### 1. Cloche de notifications dans la navbar
- Affiche le nombre de notifications non lues avec un badge rouge
- Clic pour ouvrir le modal des notifications

### 2. Modal des notifications
- **Onglet "Actives"** : Notifications non lues (unreadOnly=true)
- **Onglet "Lues"** : Notifications archivées (status=ARCHIVED)
- Bouton d'archivage pour chaque notification active
- Scroll area pour gérer de nombreuses notifications

### 3. WebSocket en temps réel
- Connexion automatique au WebSocket lors du chargement
- Écoute des notifications sur `/user/{userId}/notifications`
- Toast automatique en haut à droite pour chaque nouvelle notification
- Invalidation automatique du cache pour rafraîchir les données

### 4. Services et hooks
- `webSocketService` : Gestion de la connexion WebSocket
- `useWebSocketNotifications` : Hook pour gérer les notifications temps réel
- `notificationService` : API calls pour les notifications
- `useNotifications` : Hook React Query pour la gestion des données

## Configuration requise

### Variables d'environnement
```env
NEXT_PUBLIC_WS_URL="http://localhost:8888/ws"
```

### Endpoints utilisés
- `GET /notifications/users/{userId}?unreadOnly=true` - Notifications non lues
- `GET /notifications/users/{userId}?unreadOnly=false` - Toutes les notifications (filtrées côté client pour les archivées)
- `PATCH /notifications/archive` - Archiver une notification

### Types de notifications supportés
- NEW_OFFER
- NEW_APPLICATION
- CONVENTION_VALIDATION
- ADMIN_APPROVAL
- CONVENTION_VALIDATION_REMINDER
- APPLICATION_DECISION_REMINDER

## Utilisation

1. La cloche s'affiche automatiquement dans la navbar
2. Le badge rouge indique le nombre de notifications non lues
3. Clic sur la cloche pour ouvrir le modal
4. Les nouvelles notifications apparaissent automatiquement via WebSocket
5. Archiver une notification la déplace vers l'onglet "Lues"

## Architecture

```
components/
├── layout/
│   ├── navbar.tsx (cloche + badge)
│   └── notifications-modal.tsx (modal avec onglets)
├── ui/
│   └── scroll-area.tsx (composant scroll)
hooks/
├── useNotifications.ts (gestion des données)
└── useWebSocketNotifications.ts (WebSocket + toasts)
lib/
└── websocket.ts (service WebSocket)
services/
└── notificationService.ts (API calls)
```