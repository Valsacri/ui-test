import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  ArrowLeft,
  Star,
  Share2,
  Bookmark,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { SERVICES } from '@/app/data/exploreData';
import { toast } from 'sonner';
import { DateTimePicker } from '@/app/components/DateTimePicker';

interface ServiceDetailProps {
  serviceId: string;
  onBack: () => void;
}

export function ServiceDetail({ serviceId, onBack }: ServiceDetailProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');

  const service = SERVICES.find(s => s.id === serviceId);

  if (!service) {
    return null;
  }

  const handleBooking = () => {
    if (!bookingDate || !bookingTime) {
      toast.error('Please select date and time');
      return;
    }
    toast.success(`Booking confirmed for ${service.name}!`);
    setShowBooking(false);
    setBookingDate('');
    setBookingTime('');
    setNotes('');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header Buttons */}
        <div className="relative py-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-white/90 hover:bg-white shadow-sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white shadow-sm"
              onClick={() => toast('Share feature coming soon!')}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/90 hover:bg-white shadow-sm"
              onClick={() => toast('Saved to bookmarks!')}
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 -mt-8">
          <Card className="mb-4">
            <CardContent className="p-6">
              {/* Service Image */}
              <div className="mb-6 -mx-6 -mt-6">
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Title & Rating */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-1">{service.name}</h1>
                    <p className="text-sm text-muted-foreground">by {service.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">${service.price}</p>
                    <p className="text-xs text-muted-foreground">{service.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-muted-foreground">({service.reviews} reviews)</span>
                  </div>
                  <Badge variant="secondary">{service.category}</Badge>
                  {service.verified && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About this service</h3>
                <p className="text-muted-foreground">
                  Professional {service.name.toLowerCase()} service provided by certified experts. 
                  We offer personalized sessions tailored to your needs and goals. 
                  Perfect for beginners and advanced practitioners alike.
                </p>
              </div>

              {/* What's Included */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">What's Included</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{service.duration} session duration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Personalized training plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Post-session support</span>
                  </li>
                </ul>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Duration</p>
                    <p className="text-sm text-muted-foreground">{service.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Availability</p>
                    <p className="text-sm text-muted-foreground">7 days a week</p>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                size="lg"
                onClick={() => setShowBooking(true)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book This Service
              </Button>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Client Reviews</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="font-medium text-sm">Client {i}</span>
                      <span className="text-xs text-muted-foreground">{i} month ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Excellent service! Very professional and knowledgeable. Highly recommend!
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {service.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <DateTimePicker
              label="Preferred Date"
              type="date"
              value={bookingDate}
              onChange={setBookingDate}
              required
              placeholder="Select a date"
              minDate={new Date().toISOString().split('T')[0]}
            />

            <DateTimePicker
              label="Preferred Time"
              type="time"
              value={bookingTime}
              onChange={setBookingTime}
              required
              placeholder="Select a time"
            />

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your goals or any specific requirements..."
                rows={3}
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Total</p>
                  <p className="text-xs text-muted-foreground">{service.duration} session</p>
                </div>
                <p className="text-2xl font-bold text-green-600">${service.price}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBooking(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}