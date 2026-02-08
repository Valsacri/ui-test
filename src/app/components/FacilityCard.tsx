import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { MapPin, Star, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface FacilityCardProps {
  id: string;
  name: string;
  type: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: string;
  amenities: string[];
  onClick: () => void;
  userType?: 'user' | 'business' | 'squad';
}

export function FacilityCard({
  name,
  type,
  image,
  location,
  rating,
  reviews,
  priceRange,
  amenities,
  onClick,
  userType,
}: FacilityCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200" 
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
          <motion.img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          <Badge className="absolute top-3 left-3 bg-white/95 text-[#003C66] border-0 shadow-md">
            {type}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight flex-1">{name}</h3>
            <span className="text-sm font-bold text-[#FC8936] whitespace-nowrap">{priceRange}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 text-[#FC8936]" />
            <span className="truncate">{location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity} 
                className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1 font-medium">
                +{amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Action Button */}
          {userType && (
            <div className="pt-2">
              {userType === 'user' || userType === 'squad' ? (
                <Button
                  className="w-full bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('Booking request sent!');
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Facility
                </Button>
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