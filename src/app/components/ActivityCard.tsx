import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ActivityCardProps {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  sponsored?: boolean;
  image?: string;
  onClick?: () => void;
  userType?: 'user' | 'business' | 'squad';
  isJoined?: boolean;
}

export function ActivityCard({
  title,
  sport,
  location,
  date,
  time,
  participants,
  maxParticipants,
  level,
  sponsored = false,
  image,
  onClick,
  userType,
  isJoined
}: ActivityCardProps) {
  const spotsLeft = maxParticipants - participants;
  const fillPercentage = (participants / maxParticipants) * 100;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className="overflow-hidden transition-all duration-300 cursor-pointer card-soft rounded-xl group"
        onClick={onClick}
      >
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden bg-muted">
            <motion.img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {sponsored && (
              <Badge className="absolute top-3 right-3 bg-[#FC8936] text-white border-0 shadow-md">
                <Trophy className="w-3 h-3 mr-1" />
                Sponsored
              </Badge>
            )}
          </div>
        )}

        <CardContent className="p-5 space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-1 text-foreground">{title}</h3>
            <p className="text-sm text-primary font-medium">{sport}</p>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
              </div>
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
              </div>
              <span>{date} - {time}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-secondary" />
              </div>
              <span>{participants}/{maxParticipants} participants</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${fillPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <Badge 
              variant="outline" 
              className="border-primary/30 text-primary font-medium rounded-lg"
            >
              {level}
            </Badge>
            <span className={`text-xs font-medium ${spotsLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
            </span>
          </div>

          {/* Action Button */}
          {userType && (
            <div className="pt-2">
              {userType === 'user' ? (
                isJoined ? (
                  <Button
                    variant="outline"
                    className="w-full border-[#003C66] text-[#003C66]"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Joined
                  </Button>
                ) : spotsLeft > 0 ? (
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success('Successfully joined the activity!');
                    }}
                  >
                    Join Activity
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    Full
                  </Button>
                )
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-[#003C66] text-[#003C66] hover:bg-[#003C66] hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  View Details
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
