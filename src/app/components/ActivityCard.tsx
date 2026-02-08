import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { spacing, elevation, iconSize } from '@/lib/design-system';

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
  organizer?: string;
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
  organizer,
  onClick,
  userType,
  isJoined
}: ActivityCardProps) {
  const spotsLeft = maxParticipants - participants;
  const fillPercentage = (participants / maxParticipants) * 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className={`overflow-hidden ${elevation.low} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
        onClick={onClick}
      >
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
            <motion.img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            {sponsored && (
              <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-md gap-1">
                <Trophy className={iconSize.xs} />
                Sponsored
              </Badge>
            )}
          </div>
        )}

        <CardContent className={`p-4 ${spacing.sm}`}>
          {/* Header */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg leading-tight mb-1 text-gray-900">{title}</h3>
            {organizer && <p className="text-xs text-[#FC8936] font-medium mb-1">{organizer}</p>}
            <p className="text-sm text-primary font-medium">{sport}</p>
          </div>

          {/* Details */}
          <div className={`${spacing.xs} text-sm mb-3`}>
            <div className={`flex items-center ${spacing.xs} text-gray-600`}>
              <MapPin className={`${iconSize.sm} flex-shrink-0 text-[#FC8936]`} />
              <span className="truncate">{location}</span>
            </div>
            <div className={`flex items-center ${spacing.xs} text-gray-600`}>
              <Calendar className={`${iconSize.sm} flex-shrink-0 text-[#FC8936]`} />
              <span>{date} • {time}</span>
            </div>
            <div className={`flex items-center ${spacing.xs} text-gray-600`}>
              <Users className={`${iconSize.sm} flex-shrink-0 text-[#FC8936]`} />
              <span>{participants}/{maxParticipants} participants</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#003C66] to-[#FC8936]"
                initial={{ width: 0 }}
                animate={{ width: `${fillPercentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Badge 
              variant="outline" 
              className="border-[#003C66] text-primary font-medium"
            >
              {level}
            </Badge>
            <span className={`text-xs font-medium ${spotsLeft <= 3 ? 'text-red-600' : 'text-gray-500'}`}>
              {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
            </span>
          </div>

          {/* Action Button */}
          {userType && (
            <div className="mt-3">
              {userType === 'user' ? (
                isJoined ? (
                  <Button
                    variant="outline"
                    className="w-full border-[#003C66] text-primary hover:bg-primary hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Joined
                  </Button>
                ) : spotsLeft > 0 ? (
                  <Button
                    className="w-full bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white shadow-sm"
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
                  className="w-full border-[#003C66] text-primary hover:bg-primary hover:text-white"
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