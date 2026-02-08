import { Calendar, MapPin, Users, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface RecommendationActivityCardProps {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image?: string;
  reason: string;
  onJoin: (id: string) => void;
  isJoined?: boolean;
}

export function RecommendationActivityCard({
  id,
  title,
  sport,
  location,
  date,
  time,
  participants,
  maxParticipants,
  level,
  image,
  reason,
  onJoin,
  isJoined = false
}: RecommendationActivityCardProps) {
  return (
    <div className="flex gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow bg-white">
      {/* Activity Image */}
      {image && (
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-green-100">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Activity Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight truncate">{title}</h4>
            <p className="text-xs text-muted-foreground">{sport}</p>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0">{level}</Badge>
        </div>
        
        <div className="space-y-1 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{date} • {time}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 flex-shrink-0" />
            <span>{participants}/{maxParticipants} joined</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-purple-700 flex-1 min-w-0">
            <strong>Why:</strong> {reason}
          </p>
          <Button 
            size="sm" 
            className="h-7 text-xs flex-shrink-0"
            onClick={() => onJoin(id)}
            disabled={isJoined}
            variant={isJoined ? "outline" : "default"}
          >
            {isJoined ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Joined
              </>
            ) : (
              'Join'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
