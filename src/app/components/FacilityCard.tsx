import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { MapPin, Star, Calendar, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { spacing, elevation, iconSize } from '@/lib/design-system';

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
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className={`overflow-hidden cursor-pointer ${elevation.low} hover:shadow-lg transition-shadow duration-200`}
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
          <motion.img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <Badge className="absolute top-3 left-3 bg-white/95 text-[#003C66] border-0 shadow-md font-medium">
            {type}
          </Badge>
        </div>

        <CardContent className={`p-4 ${spacing.sm}`}>
          {/* Header */}
          <div className={`flex items-start justify-between ${spacing.xs} mb-3`}>
            <h3 className="font-semibold text-lg leading-tight flex-1 text-gray-900">{name}</h3>
            <span className="text-sm font-bold text-[#FC8936] whitespace-nowrap">{priceRange}</span>
          </div>
          
          {/* Location */}
          <div className={`flex items-center ${spacing.xs} text-sm text-gray-600 mb-2`}>
            <MapPin className={`${iconSize.sm} flex-shrink-0 text-[#FC8936]`} />
            <span className="truncate">{location}</span>
          </div>

          {/* Rating */}
          <div className={`flex items-center ${spacing.xs} mb-3`}>
            <div className={`flex items-center ${spacing.xs}`}>
              <Star className={`${iconSize.sm} fill-yellow-400 text-yellow-400`} />
              <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-t border-gray-100 pt-3">
            {amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity} 
                className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2.5 py-1 rounded-full font-medium border border-gray-200"
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
            <div>
              {userType === 'user' || userType === 'squad' ? (
                <Button
                  className="w-full bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('Booking request sent!');
                  }}
                >
                  <Calendar className={`${iconSize.sm} mr-2`} />
                  Book Facility
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-[#003C66] text-[#003C66] hover:bg-primary hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Eye className={`${iconSize.sm} mr-2`} />
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