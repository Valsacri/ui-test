import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Star, Clock, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ServiceCardProps {
  id: string;
  name: string;
  provider: string;
  image: string;
  category: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviews: number;
  duration: string;
  onClick: () => void;
  userType?: 'user' | 'business' | 'squad';
}

export function ServiceCard({
  name,
  provider,
  image,
  category,
  price,
  priceUnit,
  rating,
  reviews,
  duration,
  onClick,
  userType,
}: ServiceCardProps) {
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
            {category}
          </Badge>
          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 text-gray-900 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500">({reviews.toLocaleString()})</span>
            </div>
          </div>
          {/* Price Badge */}
          <div className="absolute -bottom-3 right-3 bg-primary/95 text-white px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="font-bold text-lg leading-tight">${price}</div>
              <div className="w-full h-px bg-white/30 my-1"></div>
              <div className="text-sm font-medium">{duration}</div>
            </div>
          </div>
        </div>

        <CardContent className="space-y-3 pt-5 px-4 pb-6">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-base leading-tight mb-1">{name}</h3>
            <p className="text-xs text-[#FC8936] font-medium">{provider}</p>
          </div>

          {/* Action */}
          <div className="pt-1">
            {/* Action Button */}
            {userType && (
              <Button
                className="w-full bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.success('Service booked!');
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Service
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}