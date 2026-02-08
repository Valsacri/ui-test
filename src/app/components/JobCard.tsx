import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Building2, DollarSign, Clock, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  description: string;
  posted: string;
  remote: boolean;
  onClick: () => void;
}

export function JobCard({
  title,
  company,
  type,
  location,
  salary,
  description,
  posted,
  remote,
  onClick,
}: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200"
        onClick={onClick}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-2">{title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 flex-shrink-0 text-[#FC8936]" />
                <span className="font-medium">{company}</span>
              </div>
            </div>
            <Badge className="bg-[#003C66] hover:bg-[#003C66] text-white border-0 shrink-0">
              {type}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {remote ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">Remote</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-[#FC8936]" />
                  <span className="text-gray-600">{location}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-[#FC8936]" />
              <span className="text-gray-600 font-medium">{salary}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{posted}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}