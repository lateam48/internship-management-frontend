"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationDTO } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Archive } from "lucide-react";

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

export function NotificationsModal({ open, onOpenChange, userId }: NotificationsModalProps) {
  const unreadNotifications = useNotifications({ 
    userId, 
    status: "UNREAD"
  });
  
  const archivedNotifications = useNotifications({ 
    userId, 
    status: "ARCHIVED"
  });
  
  const { archiveNotification } = useNotifications({ userId });

  const handleArchive = (notificationId: number) => {
    archiveNotification.mutate({ notificationId, userId });
  };

  const NotificationItem = ({ notification, showArchive = false }: { notification: NotificationDTO; showArchive?: boolean }) => (
    <div className="p-4 border-b last:border-b-0 hover:bg-muted/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{notification.subject}</h4>
            <Badge variant="secondary" className="text-xs">
              {notification.type.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{notification.content}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { 
              addSuffix: true, 
              locale: fr 
            })}
          </p>
        </div>
        {showArchive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleArchive(notification.id)}
            disabled={archiveNotification.isPending}
          >
            <Archive className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Actives ({unreadNotifications.notificationByStatus.data?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="archived">
              Lues ({archivedNotifications.notificationByStatus.data?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            <ScrollArea className="h-[400px]">
              {unreadNotifications.notificationByStatus.isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : unreadNotifications.notificationByStatus.data?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Aucune notification active
                </div>
              ) : (
                unreadNotifications.notificationByStatus.data?.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    showArchive 
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="archived" className="mt-4">
            <ScrollArea className="h-[400px]">
              {archivedNotifications.notificationByStatus.isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : archivedNotifications.notificationByStatus.data?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Aucune notification archivée
                </div>
              ) : (
                archivedNotifications.notificationByStatus.data?.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}