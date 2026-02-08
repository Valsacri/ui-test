import { Calendar } from '@/app/components/ui/calendar';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Slider } from '@/app/components/ui/slider';
import { Button } from '@/app/components/ui/button';
import { Calendar as CalendarIcon, DollarSign, MapPin, Sparkles, Clock } from 'lucide-react';
import { useState } from 'react';
import { MapFilter } from '@/app/components/MapFilter';

interface FacilitiesFilterSidebarProps {
  onDateChange?: (date: Date | undefined) => void;
  onPriceRangeChange?: (range: [number, number]) => void;
  onAmenitiesChange?: (amenities: string[]) => void;
  onDistanceChange?: (distance: number) => void;
  onTimeSlotChange?: (slot: string) => void;
}

export function FacilitiesFilterSidebar({
  onDateChange,
  onPriceRangeChange,
  onAmenitiesChange,
  onDistanceChange,
  onTimeSlotChange,
}: FacilitiesFilterSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Mock time slots with availability for facilities
  const timeSlots = [
    { time: '08:00 AM', duration: '1 hr', available: true },
    { time: '09:00 AM', duration: '1 hr', available: true },
    { time: '10:00 AM', duration: '1 hr', available: true },
    { time: '11:00 AM', duration: '1 hr', available: false },
    { time: '12:00 PM', duration: '1 hr', available: true },
    { time: '01:00 PM', duration: '1 hr', available: true },
    { time: '02:00 PM', duration: '1 hr', available: false },
    { time: '03:00 PM', duration: '1 hr', available: true },
    { time: '04:00 PM', duration: '1 hr', available: true },
    { time: '05:00 PM', duration: '1 hr', available: true },
    { time: '06:00 PM', duration: '1 hr', available: true },
    { time: '07:00 PM', duration: '1 hr', available: false },
  ];

  const amenitiesList = [
    { id: 'parking', label: 'Parking' },
    { id: 'lockers', label: 'Lockers' },
    { id: 'showers', label: 'Showers' },
    { id: 'wifi', label: 'WiFi' },
    { id: 'equipment', label: 'Equipment Rental' },
    { id: 'cafe', label: 'Café' },
  ];

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const handlePriceRangeChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setPriceRange(range);
    onPriceRangeChange?.(range);
  };

  const handleAmenityToggle = (amenityId: string) => {
    const updated = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter(id => id !== amenityId)
      : [...selectedAmenities, amenityId];
    setSelectedAmenities(updated);
    onAmenitiesChange?.(updated);
  };

  const handleDistanceChange = (value: number[]) => {
    setMaxDistance(value[0]);
    onDistanceChange?.(value[0]);
  };

  const handleTimeSlotChange = (slot: string) => {
    setSelectedTimeSlot(slot);
    onTimeSlotChange?.(slot);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Find your perfect facility
        </p>
      </div>

      <Separator />

      {/* Availability Calendar */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Booking Date</h4>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          className="rounded-md border-0"
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
        {selectedDate && (
          <div className="mt-3 pt-3 border-t">
            {/* Time Slots */}
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-[#FC8936]" />
              <h5 className="font-semibold text-xs">Available Time Slots</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                  size="sm"
                  disabled={!slot.available}
                  onClick={() => handleTimeSlotChange(slot.time)}
                  className={`flex flex-col items-start h-auto py-2 px-3 ${
                    selectedTimeSlot === slot.time
                      ? 'bg-[#003C66] hover:bg-[#002A4A] text-white'
                      : 'hover:border-[#FC8936]'
                  } ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="font-semibold text-xs">{slot.time}</span>
                  <span className="text-xs opacity-75">
                    {slot.available ? slot.duration : 'Booked'}
                  </span>
                </Button>
              ))}
            </div>
            {selectedTimeSlot && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTimeSlotChange('')}
                className="w-full mt-2 text-xs text-[#003C66]"
              >
                Clear time selection
              </Button>
            )}
          </div>
        )}
      </Card>

      <Separator />

      {/* Price Range */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Price Range</h4>
        </div>
        <div className="space-y-4">
          <Slider
            min={0}
            max={200}
            step={10}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              ${priceRange[0]}/hr
            </Badge>
            <Badge variant="outline" className="text-xs">
              ${priceRange[1]}/hr
            </Badge>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Map Filter - replaces old Distance filter */}
      <MapFilter
        title="Location & Distance"
        defaultDistance={maxDistance}
        minDistance={1}
        maxDistance={50}
        onDistanceChange={(distance) => {
          setMaxDistance(distance);
          onDistanceChange?.(distance);
        }}
        onViewMap={() => console.log('View map clicked')}
        onUseMyLocation={() => console.log('Use my location clicked')}
      />

      <Separator />

      {/* Amenities */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Amenities</h4>
        </div>
        <div className="space-y-3">
          {amenitiesList.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={amenity.id}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => handleAmenityToggle(amenity.id)}
              />
              <Label
                htmlFor={amenity.id}
                className="cursor-pointer font-normal text-sm"
              >
                {amenity.label}
              </Label>
            </div>
          ))}
        </div>
        {selectedAmenities.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              {selectedAmenities.length} selected
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedAmenities.map((id) => {
                const amenity = amenitiesList.find(a => a.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {amenity?.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}