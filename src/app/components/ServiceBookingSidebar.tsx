import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Calendar, Clock, CheckCircle2, User } from 'lucide-react';
import { DateTimePicker } from '@/app/components/DateTimePicker';

interface ServiceBookingSidebarProps {
  serviceName: string;
  serviceImage: string;
  provider: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  verified: boolean;
  onBooking: (date: string, time: string, notes: string) => void;
}

export function ServiceBookingSidebar({
  serviceName,
  serviceImage,
  provider,
  price,
  duration,
  rating,
  reviews,
  verified,
  onBooking
}: ServiceBookingSidebarProps) {
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleBooking = () => {
    onBooking(bookingDate, bookingTime, notes);
  };

  return (
    <Card className="sticky top-24 border-2">
      <CardContent className="p-6 space-y-4">
        {/* Service Preview */}
        <div className="flex gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={serviceImage}
              alt={serviceName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{serviceName}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{provider}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span className="text-yellow-500">★</span>
              <span>{rating}</span>
              <span>({reviews})</span>
              {verified && (
                <CheckCircle2 className="w-3 h-3 text-blue-600 ml-1" />
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold">${price}</span>
          </div>
          <p className="text-sm text-muted-foreground">{duration} session</p>
        </div>

        <Separator />

        {/* Date Picker */}
        <div>
          <DateTimePicker
            label="Preferred Date"
            type="date"
            value={bookingDate}
            onChange={setBookingDate}
            required
            placeholder="Select a date"
            minDate={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Time Picker */}
        {bookingDate && (
          <div>
            <DateTimePicker
              label="Preferred Time"
              type="time"
              value={bookingTime}
              onChange={setBookingTime}
              required
              placeholder="Select a time"
            />
          </div>
        )}

        {/* Notes */}
        {bookingDate && bookingTime && (
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us about your goals..."
              rows={3}
              className="text-sm"
            />
          </div>
        )}

        <Separator />

        {/* Summary */}
        {bookingDate && bookingTime && (
          <div className="bg-green-50 p-3 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="font-medium">
                {new Date(bookingDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="font-medium">{bookingTime}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total</span>
              <span className="text-xl font-bold text-green-600">${price}</span>
            </div>
          </div>
        )}

        {/* Book Button */}
        <Button
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          size="lg"
          onClick={handleBooking}
          disabled={!bookingDate || !bookingTime}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {bookingDate && bookingTime ? 'Confirm Booking' : 'Select Date & Time'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You won't be charged yet
        </p>
      </CardContent>
    </Card>
  );
}
