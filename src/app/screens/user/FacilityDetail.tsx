import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Calendar } from '@/app/components/ui/calendar';
import { Separator } from '@/app/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Share2,
  Bookmark,
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  Wifi,
  Dumbbell,
  Droplet,
  Shield,
  Info,
  X,
} from 'lucide-react';
import { FACILITIES } from '@/app/data/exploreData';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface FacilityDetailProps {
  facilityId: string;
  onBack: () => void;
  renderBookingSidebar?: () => React.ReactNode;
}

const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
];

const AMENITY_ICONS: Record<string, any> = {
  Pool: Droplet,
  Sauna: Dumbbell,
  WiFi: Wifi,
  Parking: Shield,
};

export function FacilityDetail({ facilityId, onBack, renderBookingSidebar }: FacilityDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [duration, setDuration] = useState(1);
  const [participants, setParticipants] = useState(1);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const facility = FACILITIES.find(f => f.id === facilityId);

  if (!facility) {
    return null;
  }

  const images = facility.images || [facility.image];
  
  const getDayName = (date: Date) => {
    return format(date, 'EEEE');
  };

  const todayHours = facility.weeklyHours[getDayName(new Date()) as keyof typeof facility.weeklyHours];
  
  const calculateTotal = () => {
    return facility.pricePerHour * duration;
  };

  const serviceFee = calculateTotal() * 0.1;
  const totalPrice = calculateTotal() + serviceFee;

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    toast.success(`Booking confirmed for ${facility.name}!`);
    setShowBookingDialog(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toast('Share feature coming soon!')}
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toast('Saved to bookmarks!')}
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="relative">
          <div className="relative aspect-[4/3] md:aspect-[21/9] bg-gray-200">
            <img
              src={images[currentImageIndex]}
              alt={facility.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Show All Photos Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-4 left-4 bg-white"
              onClick={() => setShowAllImages(true)}
            >
              Show all photos
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-6">
          {/* Details */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-semibold mb-2">{facility.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{facility.rating}</span>
                  <span className="text-muted-foreground">({facility.reviews} reviews)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{facility.location}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Type Badge */}
            <div>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {facility.type}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this facility</h2>
              <p className="text-muted-foreground leading-relaxed">
                {facility.name} is a premier sports facility in {facility.location}. 
                We offer state-of-the-art equipment and professional trainers to help you 
                achieve your fitness goals. Our facility is open to all skill levels and 
                provides a welcoming environment for everyone.
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facility.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] || Check;
                  return (
                    <div key={amenity} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Hours */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Hours</h2>
              <div className="space-y-3">
                {Object.entries(facility.weeklyHours).map(([day, hours]) => {
                  const isToday = getDayName(new Date()) === day;
                  return (
                    <div key={day} className="flex items-center justify-between">
                      <span className={isToday ? 'font-medium' : 'text-muted-foreground'}>
                        {day}
                      </span>
                      <span className={isToday ? 'font-medium' : ''}>
                        {hours.is24Hours ? '24 hours' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{facility.rating} · {facility.reviews} reviews</span>
                </div>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Sarah Mitchell', rating: 5, comment: 'Amazing facility with great equipment. Staff is very friendly and helpful!', date: '2 weeks ago' },
                  { name: 'Mike Johnson', rating: 5, comment: 'Clean, well-maintained, and never too crowded. Perfect for my morning workouts.', date: '1 month ago' },
                  { name: 'Emma Davis', rating: 4, comment: 'Great place overall. Only wish they had longer hours on weekends.', date: '1 month ago' },
                  { name: 'Alex Thompson', rating: 5, comment: 'The trainers here are top-notch. Highly recommend their personal training sessions.', date: '2 months ago' },
                ].map((review, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500" />
                      <div>
                        <p className="font-medium text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Cancellation Policy */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Cancellation policy</h2>
              <p className="text-muted-foreground">{facility.cancellationPolicy}</p>
            </div>

            <Separator />

            {/* Location Map */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Where you'll be</span>
                </div>
              </h2>
              <div className="space-y-4">
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  {/* Map Container with Interactive Pin */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Simulated map background with grid */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-50 to-green-50">
                        {/* Grid lines to simulate map */}
                        <svg className="w-full h-full opacity-20">
                          <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>
                      
                      {/* Roads/paths simulation */}
                      <svg className="absolute inset-0 w-full h-full">
                        <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#e5e7eb" strokeWidth="8" />
                        <line x1="45%" y1="0" x2="45%" y2="100%" stroke="#e5e7eb" strokeWidth="6" />
                      </svg>

                      {/* Location Pin - Centered */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                        <div className="relative">
                          {/* Pin shadow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-sm"></div>
                          
                          {/* Animated ping effect */}
                          <div className="absolute -top-2 -left-2 w-16 h-16 bg-[#003C66]/20 rounded-full animate-ping"></div>
                          
                          {/* Main pin */}
                          <div className="relative flex flex-col items-center">
                            <div className="bg-[#003C66] text-white p-3 rounded-full shadow-lg border-4 border-white">
                              <MapPin className="w-6 h-6 fill-current" />
                            </div>
                            <div className="w-1 h-4 bg-[#003C66]"></div>
                          </div>
                        </div>
                      </div>

                      {/* Nearby landmarks indicators */}
                      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full shadow"></div>
                      <div className="absolute top-3/4 left-2/3 w-3 h-3 bg-blue-500 rounded-full shadow"></div>
                      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full shadow"></div>
                    </div>
                  </div>

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white hover:bg-gray-100 shadow-md h-8 w-8 p-0"
                      onClick={() => toast.info('Zoom in')}
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white hover:bg-gray-100 shadow-md h-8 w-8 p-0"
                      onClick={() => toast.info('Zoom out')}
                    >
                      −
                    </Button>
                  </div>

                  {/* Get Directions Button */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button
                      className="w-full bg-white hover:bg-gray-50 text-[#003C66] shadow-lg border border-gray-200"
                      onClick={() => toast.success('Opening directions...')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>

                {/* Location Details */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#003C66] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium mb-1">{facility.name}</p>
                      <p className="text-sm text-muted-foreground">{facility.location}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Exact location will be provided after booking confirmation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Images Dialog */}
      <Dialog open={showAllImages} onOpenChange={setShowAllImages}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>All photos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 overflow-y-auto">
            {images.map((image, index) => (
              <div key={index} className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <img src={image} alt={`${facility.name} ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm your booking</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Not selected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTime || 'Not selected'}
                    {facility.pricePerHour > 0 && duration > 1 && ` (${duration} hours)`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Participants</p>
                  <p className="text-sm text-muted-foreground">{participants} {participants === 1 ? 'person' : 'people'}</p>
                </div>
              </div>

              {facility.pricePerHour > 0 && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total price</p>
                    <p className="text-sm text-muted-foreground">${totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Cancellation policy</p>
                <p className="text-xs text-blue-700 mt-1">{facility.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}