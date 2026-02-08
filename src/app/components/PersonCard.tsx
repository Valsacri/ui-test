import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Card, CardContent } from '@/app/components/ui/card';
import { CheckCircle2, MapPin, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface PersonCardProps {
  id: string;
  name: string;
  bio: string;
  location: string;
  avatar?: string;
  verified?: boolean;
  followers: number;
  sports: string[];
  onClick: () => void;
}

export function PersonCard({
  name,
  bio,
  location,
  avatar,
  verified,
  followers,
  sports,
  onClick,
}: PersonCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className="hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200" 
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar className="w-16 h-16 flex-shrink-0 ring-2 ring-offset-2 ring-gray-100">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#FC8936] text-white font-semibold text-lg">
                  {name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="font-semibold text-base truncate">{name}</h3>
                {verified && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {bio}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FC8936]" />
                  <span className="truncate">{location}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#FC8936]" />
                  <span>{followers.toLocaleString()}</span>
                </div>
              </div>

              {/* Sports Tags */}
              <div className="flex flex-wrap gap-1.5">
                {sports.slice(0, 3).map((sport) => (
                  <span
                    key={sport}
                    className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
                  >
                    {sport}
                  </span>
                ))}
                {sports.length > 3 && (
                  <span className="text-xs px-2 py-1 text-gray-500 font-medium">
                    +{sports.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}