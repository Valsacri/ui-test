import { Calendar } from '@/app/components/ui/calendar';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Button } from '@/app/components/ui/button';
import { Users, Calendar as CalendarIcon, Target, Clock, Calendar as CalendarCheck } from 'lucide-react';
import { useState } from 'react';

interface ActivitiesFilterSidebarProps {
  onDateChange?: (date: Date | undefined) => void;
  onActivityTypeChange?: (type: 'all' | 'solo' | 'squad') => void;
  onParticipantsChange?: (range: [number, number]) => void;
  onTimeSlotChange?: (slot: string) => void;
  onSportCategoriesChange?: (categories: string[]) => void;
}

export function ActivitiesFilterSidebar({
  onDateChange,
  onActivityTypeChange,
  onParticipantsChange,
  onTimeSlotChange,
  onSportCategoriesChange,
}: ActivitiesFilterSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activityType, setActivityType] = useState<'all' | 'solo' | 'squad'>('all');
  const [participantRange, setParticipantRange] = useState<[number, number]>([1, 50]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSportCategories, setSelectedSportCategories] = useState<string[]>([]);

  // Mock time slots with availability
  const timeSlots = [
    { time: '06:00 AM', available: true, count: 3 },
    { time: '08:00 AM', available: true, count: 5 },
    { time: '10:00 AM', available: true, count: 2 },
    { time: '12:00 PM', available: true, count: 4 },
    { time: '02:00 PM', available: false, count: 0 },
    { time: '04:00 PM', available: true, count: 6 },
    { time: '06:00 PM', available: true, count: 8 },
    { time: '08:00 PM', available: true, count: 3 },
  ];

  // Sport categories with counts
  const activityFormats = [
    { id: 'sessions', name: 'Sessions', count: 24, color: 'bg-blue-100 text-blue-700' },
    { id: 'camps', name: 'Camps', count: 8, color: 'bg-green-100 text-green-700' },
    { id: 'workshops', name: 'Workshops', count: 12, color: 'bg-purple-100 text-purple-700' },
    { id: 'events', name: 'Events', count: 15, color: 'bg-orange-100 text-orange-700' },
    { id: 'training', name: 'Training Programs', count: 10, color: 'bg-red-100 text-red-700' },
    { id: 'dropins', name: 'Drop-ins', count: 18, color: 'bg-cyan-100 text-cyan-700' },
    { id: 'tournaments', name: 'Tournaments', count: 6, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'classes', name: 'Classes', count: 20, color: 'bg-pink-100 text-pink-700' },
  ];

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const handleActivityTypeChange = (value: string) => {
    const type = value as 'all' | 'solo' | 'squad';
    setActivityType(type);
    onActivityTypeChange?.(type);
  };

  const handleParticipantsChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setParticipantRange(range);
    onParticipantsChange?.(range);
  };

  const handleTimeSlotChange = (value: string) => {
    setSelectedTimeSlot(value);
    onTimeSlotChange?.(value);
  };

  const handleSportCategoriesChange = (value: string[]) => {
    setSelectedSportCategories(value);
    onSportCategoriesChange?.(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Refine your activity search
        </p>
      </div>

      <Separator />

      {/* Availability Calendar */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Availability</h4>
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
            <div className="grid grid-cols-2 gap-2">
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
                    {slot.available ? `${slot.count} activities` : 'Full'}
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

      {/* Activity Type */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Activity Type</h4>
        </div>
        <RadioGroup value={activityType} onValueChange={handleActivityTypeChange}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer font-normal">
                  All Activities
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                All
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo" className="cursor-pointer font-normal">
                  Solo Activities
                </Label>
              </div>
              <Badge variant="outline" className="text-xs border-[#003C66] text-[#003C66]">
                Individual
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="squad" id="squad" />
                <Label htmlFor="squad" className="cursor-pointer font-normal">
                  Squad Activities
                </Label>
              </div>
              <Badge variant="outline" className="text-xs border-[#FC8936] text-[#FC8936]">
                Team
              </Badge>
            </div>
          </div>
        </RadioGroup>
      </Card>

      <Separator />

      {/* Activity Format */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarCheck className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Activity Format</h4>
        </div>
        <div className="space-y-3">
          {activityFormats.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedSportCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleSportCategoriesChange([...selectedSportCategories, category.id]);
                    } else {
                      handleSportCategoriesChange(
                        selectedSportCategories.filter((id) => id !== category.id)
                      );
                    }
                  }}
                />
                <Label htmlFor={category.id} className="cursor-pointer font-normal">
                  {category.name}
                </Label>
              </div>
              <Badge variant="outline" className={`text-xs ${category.color} border-0`}>
                {category.count}
              </Badge>
            </div>
          ))}
        </div>
        {selectedSportCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSportCategoriesChange([])}
            className="w-full mt-3 text-xs text-[#003C66]"
          >
            Clear all ({selectedSportCategories.length} selected)
          </Button>
        )}
      </Card>

      <Separator />

      {/* Participants Range */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Participants</h4>
        </div>
        <div className="space-y-4">
          <Slider
            min={1}
            max={50}
            step={1}
            value={participantRange}
            onValueChange={handleParticipantsChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {participantRange[0]} {participantRange[0] === 1 ? 'person' : 'people'}
            </span>
            <span className="text-muted-foreground">
              {participantRange[1]} {participantRange[1] === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}