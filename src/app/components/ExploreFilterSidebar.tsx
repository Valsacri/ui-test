import { Calendar } from '@/app/components/ui/calendar';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Button } from '@/app/components/ui/button';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Target, 
  Clock, 
  Building2, 
  ShoppingBag, 
  Wrench,
  UserCircle,
  DollarSign,
  Star
} from 'lucide-react';
import { useState } from 'react';
import { MapFilter } from '@/app/components/MapFilter';

interface ExploreFilterSidebarProps {
  activeTab: 'activities' | 'facilities' | 'products' | 'services' | 'people';
  onFilterChange?: (filters: any) => void;
}

export function ExploreFilterSidebar({ activeTab, onFilterChange }: ExploreFilterSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activityType, setActivityType] = useState<'all' | 'solo' | 'squad'>('all');
  const [participantRange, setParticipantRange] = useState<[number, number]>([1, 50]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [facilityType, setFacilityType] = useState<string>('all');

  // Time slots for activities
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

  // Categories based on tab
  const getCategoriesForTab = () => {
    switch (activeTab) {
      case 'activities':
        return [
          { id: 'sessions', name: 'Sessions', count: 24, color: 'bg-blue-100 text-blue-700' },
          { id: 'camps', name: 'Camps', count: 8, color: 'bg-green-100 text-green-700' },
          { id: 'workshops', name: 'Workshops', count: 12, color: 'bg-purple-100 text-purple-700' },
          { id: 'events', name: 'Events', count: 15, color: 'bg-orange-100 text-orange-700' },
          { id: 'training', name: 'Training Programs', count: 10, color: 'bg-red-100 text-red-700' },
          { id: 'dropins', name: 'Drop-ins', count: 18, color: 'bg-cyan-100 text-cyan-700' },
        ];
      case 'facilities':
        return [
          { id: 'gym', name: 'Gym', count: 12, color: 'bg-blue-100 text-blue-700' },
          { id: 'court', name: 'Sports Court', count: 8, color: 'bg-green-100 text-green-700' },
          { id: 'pool', name: 'Pool', count: 5, color: 'bg-cyan-100 text-cyan-700' },
          { id: 'studio', name: 'Studio', count: 10, color: 'bg-purple-100 text-purple-700' },
          { id: 'field', name: 'Field', count: 6, color: 'bg-emerald-100 text-emerald-700' },
        ];
      case 'products':
        return [
          { id: 'equipment', name: 'Equipment', count: 45, color: 'bg-blue-100 text-blue-700' },
          { id: 'apparel', name: 'Apparel', count: 32, color: 'bg-purple-100 text-purple-700' },
          { id: 'accessories', name: 'Accessories', count: 28, color: 'bg-orange-100 text-orange-700' },
          { id: 'nutrition', name: 'Nutrition', count: 15, color: 'bg-green-100 text-green-700' },
          { id: 'tech', name: 'Tech & Gadgets', count: 12, color: 'bg-cyan-100 text-cyan-700' },
        ];
      case 'services':
        return [
          { id: 'coaching', name: 'Coaching', count: 18, color: 'bg-blue-100 text-blue-700' },
          { id: 'training', name: 'Personal Training', count: 22, color: 'bg-purple-100 text-purple-700' },
          { id: 'nutrition', name: 'Nutrition', count: 12, color: 'bg-green-100 text-green-700' },
          { id: 'physio', name: 'Physiotherapy', count: 8, color: 'bg-orange-100 text-orange-700' },
          { id: 'wellness', name: 'Wellness', count: 14, color: 'bg-pink-100 text-pink-700' },
        ];
      case 'people':
        return [
          { id: 'athletes', name: 'Athletes', count: 156, color: 'bg-blue-100 text-blue-700' },
          { id: 'coaches', name: 'Coaches', count: 45, color: 'bg-purple-100 text-purple-700' },
          { id: 'trainers', name: 'Trainers', count: 62, color: 'bg-green-100 text-green-700' },
          { id: 'enthusiasts', name: 'Enthusiasts', count: 234, color: 'bg-orange-100 text-orange-700' },
        ];
      default:
        return [];
    }
  };

  const categories = getCategoriesForTab();

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onFilterChange?.({ date });
  };

  const handleActivityTypeChange = (value: string) => {
    const type = value as 'all' | 'solo' | 'squad';
    setActivityType(type);
    onFilterChange?.({ activityType: type });
  };

  const renderActivitiesFilters = () => (
    <>
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
                  onClick={() => setSelectedTimeSlot(slot.time)}
                  className={`flex flex-col items-start h-auto py-2 px-3 ${
                    selectedTimeSlot === slot.time
                      ? 'bg-primary hover:bg-primary/90 text-white'
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
              <Badge variant="secondary" className="text-xs">All</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo" className="cursor-pointer font-normal">
                  Solo Activities
                </Label>
              </div>
              <Badge variant="outline" className="text-xs border-[#003C66] text-primary">
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
            onValueChange={(val) => setParticipantRange([val[0], val[1]])}
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

      <Separator />

      {/* Map Filter for Activities */}
      <MapFilter
        title="Location & Distance"
        defaultDistance={10}
        minDistance={1}
        maxDistance={50}
        onDistanceChange={(distance) => console.log('Distance changed:', distance)}
        onViewMap={() => console.log('View map clicked')}
        onUseMyLocation={() => console.log('Use my location clicked')}
      />
    </>
  );

  const renderFacilitiesFilters = () => (
    <>
      {/* Facility Type */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Facility Type</h4>
        </div>
        <RadioGroup value={facilityType} onValueChange={setFacilityType}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="fac-all" />
              <Label htmlFor="fac-all" className="cursor-pointer font-normal">
                All Facilities
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="indoor" id="indoor" />
              <Label htmlFor="indoor" className="cursor-pointer font-normal">
                Indoor Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outdoor" id="outdoor" />
              <Label htmlFor="outdoor" className="cursor-pointer font-normal">
                Outdoor Only
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>

      <Separator />

      {/* Amenities */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Amenities</h4>
        </div>
        <div className="space-y-3">
          {['Parking', 'Locker Rooms', 'Showers', 'WiFi', 'Equipment Rental'].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={amenity.toLowerCase()} />
              <Label htmlFor={amenity.toLowerCase()} className="cursor-pointer font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Price Range */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Price per Hour</h4>
        </div>
        <div className="space-y-4">
          <Slider
            min={0}
            max={200}
            step={5}
            value={priceRange}
            onValueChange={(val) => setPriceRange([val[0], val[1]])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">${priceRange[0]}</span>
            <span className="text-muted-foreground">${priceRange[1]}</span>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Map Filter for Facilities */}
      <MapFilter
        title="Location & Distance"
        defaultDistance={10}
        minDistance={1}
        maxDistance={50}
        onDistanceChange={(distance) => console.log('Distance changed:', distance)}
        onViewMap={() => console.log('View map clicked')}
        onUseMyLocation={() => console.log('Use my location clicked')}
      />
    </>
  );

  const renderProductsFilters = () => (
    <>
      {/* Price Range */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Price Range</h4>
        </div>
        <div className="space-y-4">
          <Slider
            min={0}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={(val) => setPriceRange([val[0], val[1]])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">${priceRange[0]}</span>
            <span className="text-muted-foreground">${priceRange[1]}</span>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Condition */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Condition</h4>
        </div>
        <div className="space-y-3">
          {['New', 'Like New', 'Good', 'Fair'].map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox id={condition.toLowerCase().replace(' ', '-')} />
              <Label htmlFor={condition.toLowerCase().replace(' ', '-')} className="cursor-pointer font-normal">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Brand */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Rating</h4>
        </div>
        <div className="space-y-3">
          {['4+ Stars', '3+ Stars', '2+ Stars'].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={rating.toLowerCase().replace(/\+|\s/g, '-')} />
              <Label htmlFor={rating.toLowerCase().replace(/\+|\s/g, '-')} className="cursor-pointer font-normal">
                {rating}
              </Label>
            </div>
          ))}
        </div>
      </Card>
    </>
  );

  const renderServicesFilters = () => (
    <>
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
      </Card>

      <Separator />

      {/* Service Type */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Service Type</h4>
        </div>
        <div className="space-y-3">
          {['One-on-One', 'Group Sessions', 'Online', 'In-Person'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type.toLowerCase().replace(/\s|-/g, '-')} />
              <Label htmlFor={type.toLowerCase().replace(/\s|-/g, '-')} className="cursor-pointer font-normal">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Price Range */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Price per Session</h4>
        </div>
        <div className="space-y-4">
          <Slider
            min={0}
            max={300}
            step={5}
            value={priceRange}
            onValueChange={(val) => setPriceRange([val[0], val[1]])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">${priceRange[0]}</span>
            <span className="text-muted-foreground">${priceRange[1]}</span>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Map Filter for Services */}
      <MapFilter
        title="Location & Distance"
        defaultDistance={10}
        minDistance={1}
        maxDistance={50}
        onDistanceChange={(distance) => console.log('Distance changed:', distance)}
        onViewMap={() => console.log('View map clicked')}
        onUseMyLocation={() => console.log('Use my location clicked')}
      />
    </>
  );

  const renderPeopleFilters = () => (
    <>
      {/* User Type */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <UserCircle className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">User Type</h4>
        </div>
        <div className="space-y-3">
          {['All', 'Looking for Partners', 'Coaches', 'Trainers'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={`user-${type.toLowerCase().replace(/\s/g, '-')}`} />
              <Label htmlFor={`user-${type.toLowerCase().replace(/\s/g, '-')}`} className="cursor-pointer font-normal">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Sports Interests */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Sports Interests</h4>
        </div>
        <div className="space-y-3">
          {['Basketball', 'Tennis', 'Running', 'Yoga', 'Swimming'].map((sport) => (
            <div key={sport} className="flex items-center space-x-2">
              <Checkbox id={`sport-${sport.toLowerCase()}`} />
              <Label htmlFor={`sport-${sport.toLowerCase()}`} className="cursor-pointer font-normal">
                {sport}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Skill Level */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Skill Level</h4>
        </div>
        <div className="space-y-3">
          {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox id={`level-${level.toLowerCase()}`} />
              <Label htmlFor={`level-${level.toLowerCase()}`} className="cursor-pointer font-normal">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </Card>
    </>
  );

  const getIconForTab = () => {
    switch (activeTab) {
      case 'activities':
        return <Target className="w-5 h-5 text-[#FC8936]" />;
      case 'facilities':
        return <Building2 className="w-5 h-5 text-[#FC8936]" />;
      case 'products':
        return <ShoppingBag className="w-5 h-5 text-[#FC8936]" />;
      case 'services':
        return <Wrench className="w-5 h-5 text-[#FC8936]" />;
      case 'people':
        return <UserCircle className="w-5 h-5 text-[#FC8936]" />;
    }
  };

  const getTitleForTab = () => {
    switch (activeTab) {
      case 'activities':
        return 'Activity Filters';
      case 'facilities':
        return 'Facility Filters';
      case 'products':
        return 'Product Filters';
      case 'services':
        return 'Service Filters';
      case 'people':
        return 'People Filters';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        {getIconForTab()}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{getTitleForTab()}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Refine your search results
          </p>
        </div>
      </div>

      <Separator />

      {/* Category Filter - Common to all tabs */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Category</h4>
        </div>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(selectedCategories.filter((id) => id !== category.id));
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
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategories([])}
            className="w-full mt-3 text-xs text-primary"
          >
            Clear all ({selectedCategories.length} selected)
          </Button>
        )}
      </Card>

      <Separator />

      {/* Tab-specific filters */}
      {activeTab === 'activities' && renderActivitiesFilters()}
      {activeTab === 'facilities' && renderFacilitiesFilters()}
      {activeTab === 'products' && renderProductsFilters()}
      {activeTab === 'services' && renderServicesFilters()}
      {activeTab === 'people' && renderPeopleFilters()}
    </div>
  );
}