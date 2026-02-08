import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ArrowLeft, Heart, MessageCircle, UserPlus, Calendar, Trophy, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'activity' | 'achievement';
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    userName: 'Sarah Mitchell',
    text: 'liked your post',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: 'n2',
    type: 'comment',
    userName: 'Mike Rodriguez',
    text: 'commented on your workout: "Great progress! 💪"',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
  },
  {
    id: 'n3',
    type: 'follow',
    userName: 'Emma Lopez',
    text: 'started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: 'n4',
    type: 'activity',
    userName: 'Jordan Davis',
    text: 'invited you to join "Basketball Pickup Game"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
  },
  {
    id: 'n5',
    type: 'achievement',
    userName: 'Sporgates',
    text: 'You completed your weekly running goal! 🎉',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: 'n6',
    type: 'like',
    userName: 'Alex Chen',
    text: 'liked your photo',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: 'n7',
    type: 'comment',
    userName: 'Sarah Mitchell',
    text: 'commented: "See you tomorrow!"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
  },
];

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => !n.read);
  const allNotifications = MOCK_NOTIFICATIONS;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'activity':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={`flex items-start gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.read ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={notification.userAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
            {notification.userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{notification.userName}</span>{' '}
          <span className="text-muted-foreground">{notification.text}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </p>
      </div>

      {!notification.read && (
        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Notifications</h1>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadNotifications.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadNotifications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="max-w-4xl mx-auto">
                {allNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              <div className="max-w-4xl mx-auto">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="text-center py-12 px-4">
                    <p className="text-muted-foreground">No unread notifications</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
