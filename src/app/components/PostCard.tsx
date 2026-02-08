import { Heart, MessageCircle, Share2, MapPin, Trophy, MoreHorizontal, Tag, Calendar, DollarSign, Clock, Building2 } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

interface PostCardProps {
  id: string;
  type?: 'product' | 'service' | 'facility' | 'event';
  userName: string;
  userAvatar?: string;
  timestamp: string;
  content: string;
  image?: string;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[];
  sponsored?: boolean;
  activity?: {
    id: string;
    name: string;
  };
  // Product specific
  price?: number;
  originalPrice?: number;
  productId?: string;
  // Service specific
  duration?: string;
  serviceId?: string;
  // Event specific
  eventDate?: string;
  participants?: number;
  eventId?: string;
  // Facility specific
  facilityId?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onLocationClick?: () => void;
  onActivityClick?: () => void;
}

export function PostCard({
  type,
  userName,
  userAvatar,
  timestamp,
  content,
  image,
  location,
  likes,
  comments,
  shares,
  tags,
  sponsored,
  activity,
  price,
  originalPrice,
  productId,
  duration,
  serviceId,
  eventDate,
  participants,
  eventId,
  facilityId,
  onLike,
  onComment,
  onShare,
  onLocationClick,
  onActivityClick,
}: PostCardProps) {
  const getBadgeForType = () => {
    if (!type) return null;
    
    const configs = {
      product: { label: 'New Product', icon: Tag, className: 'bg-purple-100 text-purple-800 border-purple-200' },
      service: { label: 'New Service', icon: Clock, className: 'bg-green-100 text-green-800 border-green-200' },
      facility: { label: 'New Facility', icon: Building2, className: 'bg-blue-100 text-blue-800 border-blue-200' },
      event: { label: 'Upcoming Event', icon: Calendar, className: 'bg-orange-100 text-orange-800 border-orange-200' },
    };
    
    const config = configs[type];
    const Icon = config.icon;
    
    return (
      <Badge variant="secondary" className={`${config.className} text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardContent className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{userName}</p>
                {getBadgeForType()}
                {sponsored && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    Sponsored
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm mb-3 leading-relaxed">{content}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="text-xs text-blue-600 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {location && (
          <button
            onClick={onLocationClick}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-600 transition-colors mb-3"
          >
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </button>
        )}
      </CardContent>

      {/* Image */}
      {image && (
        <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <img src={image} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Type-specific info cards - positioned after image */}
      {type === 'product' && price && (
        <CardContent className="px-4 pt-3 pb-0">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 font-medium mb-1">Product Price</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-purple-900">${price.toFixed(2)}</p>
                  {originalPrice && originalPrice > price && (
                    <p className="text-sm text-purple-600 line-through">${originalPrice.toFixed(2)}</p>
                  )}
                </div>
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                View Product
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {type === 'service' && (price || duration) && (
        <CardContent className="px-4 pt-3 pb-0">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium mb-1">Service Details</p>
                <div className="flex items-center gap-3">
                  {price && <p className="text-lg font-bold text-green-900">${price}/session</p>}
                  {duration && <p className="text-sm text-green-700">• {duration}</p>}
                </div>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {type === 'facility' && (
        <CardContent className="px-4 pt-3 pb-0">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium mb-1">Facility Info</p>
                <p className="text-sm text-blue-900 font-semibold">Now Open for Bookings</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {type === 'event' && (eventDate || participants) && (
        <CardContent className="px-4 pt-3 pb-0">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-orange-600 font-medium">Event Details</p>
                {eventDate && (
                  <div className="flex items-center gap-1 text-sm text-orange-900">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">{eventDate}</span>
                  </div>
                )}
                {participants && (
                  <p className="text-xs text-orange-700">{participants}+ participants expected</p>
                )}
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                Register
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {/* Activity Link */}
      {activity && (
        <CardContent className="px-4 py-3">
          <button
            onClick={onActivityClick}
            className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors"
          >
            <p className="text-xs text-blue-600 font-medium">Related Activity</p>
            <p className="text-sm font-semibold text-blue-900">{activity.name}</p>
          </button>
        </CardContent>
      )}

      {/* Actions */}
      <CardContent className="p-4 pt-3">
        <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
          <span>{likes} likes</span>
          <span>{comments} comments • {shares} shares</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2"
            onClick={onLike}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2"
            onClick={onComment}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Comment</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}