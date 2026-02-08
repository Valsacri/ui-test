import { Card, CardContent } from '@/app/components/ui/card';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface BusinessCardProps {
  id: string;
  name: string;
  type: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  description: string;
  services: string[];
  verified: boolean;
  onClick: () => void;
}

export function BusinessCard({
  name,
  type,
  image,
  location,
  rating,
  reviews,
  description,
  services,
  verified,
  onClick,
}: BusinessCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-gray-200"
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
          {verified && (
            <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-1">{name}</h3>
            <p className="text-sm text-[#003C66] font-medium">{type}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 text-[#FC8936]" />
            <span className="truncate">{location}</span>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium"
              >
                {service}
              </span>
            ))}
            {services.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1 font-medium">
                +{services.length - 3} more
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}