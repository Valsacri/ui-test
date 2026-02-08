import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Calendar } from '@/app/components/ui/calendar';
import { Separator } from '@/app/components/ui/separator';

interface BookingSidebarProps {
  pricePerHour: number;
  capacity: number;
  itemName: string;
  onBooking: (date: Date, time: string, duration: number, participants: number) => void;
}

const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
];

export function BookingSidebar({ pricePerHour, capacity, itemName, onBooking }: BookingSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [duration, setDuration] = useState(1);
  const [participants, setParticipants] = useState(1);

  const calculateTotal = () => {
    return pricePerHour * duration;
  };

  const serviceFee = calculateTotal() * 0.1;
  const totalPrice = calculateTotal() + serviceFee;

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      onBooking(selectedDate, selectedTime, duration, participants);
    }
  };

  return (
    <Card className="sticky top-24 border-2">
      <CardContent className="p-6 space-y-4">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold">
              {pricePerHour === 0 ? 'Free' : `$${pricePerHour}`}
            </span>
            {pricePerHour > 0 && (
              <span className="text-muted-foreground">/ hour</span>
            )}
          </div>
        </div>

        <Separator />

        {/* Calendar */}
        <div>
          <label className="text-sm font-medium mb-2 block">Select date</label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <label className="text-sm font-medium mb-2 block">Select time</label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        {selectedDate && selectedTime && pricePerHour > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Duration (hours)</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDuration(Math.max(1, duration - 1))}
                disabled={duration <= 1}
              >
                -
              </Button>
              <span className="font-medium w-12 text-center">{duration}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDuration(duration + 1)}
              >
                +
              </Button>
            </div>
          </div>
        )}

        {/* Participants */}
        <div>
          <label className="text-sm font-medium mb-2 block">Participants</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setParticipants(Math.max(1, participants - 1))}
              disabled={participants <= 1}
            >
              -
            </Button>
            <span className="font-medium w-12 text-center">{participants}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setParticipants(Math.min(capacity, participants + 1))}
              disabled={participants >= capacity}
            >
              +
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Maximum capacity: {capacity}
          </p>
        </div>

        {/* Price Breakdown */}
        {selectedDate && selectedTime && pricePerHour > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                ${pricePerHour} × {duration} hour{duration > 1 ? 's' : ''}
              </span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          size="lg"
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime}
        >
          {pricePerHour === 0 ? 'Reserve spot' : 'Request to book'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You won't be charged yet
        </p>
      </CardContent>
    </Card>
  );
}
