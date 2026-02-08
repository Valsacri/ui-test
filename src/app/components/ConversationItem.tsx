import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ConversationItemProps {
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isOnline: boolean;
  verified?: boolean;
  onClick: () => void;
}

export function ConversationItem({
  userName,
  userAvatar,
  lastMessage,
  timestamp,
  unread,
  isOnline,
  verified,
  onClick,
}: ConversationItemProps) {
  return (
    <div
      className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={userAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
            {userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <h3 className={`font-semibold truncate ${unread > 0 ? 'text-foreground' : 'text-foreground'}`}>
            {userName}
          </h3>
          {verified && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
        </div>
        <p className={`text-sm truncate ${unread > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
          {lastMessage}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        {unread > 0 && (
          <Badge className="h-5 min-w-5 flex items-center justify-center px-1.5">
            {unread}
          </Badge>
        )}
      </div>
    </div>
  );
}
