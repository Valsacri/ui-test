import { Calendar as CalendarIcon, DollarSign, Tag, MapPin, Users, Clock, Star, Building2 } from 'lucide-react';
import { FilterButton } from '@/app/components/FilterButton';
import { Calendar } from '@/app/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Slider } from '@/app/components/ui/slider';
import { MapFilter } from '@/app/components/MapFilter';
import { Badge } from '@/app/components/ui/badge';

export type FilterType = 
  | 'date'
  | 'price'
  | 'location'
  | 'category'
  | 'type'
  | 'participants'
  | 'time'
  | 'rating'
  | 'facilityType';

interface CategoryOption {
  id: string;
  name: string;
  count?: number;
  color?: string;
}

interface MobileFilterBarProps {
  filters: FilterType[];
  // Date filter
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
  // Price filter
  priceRange?: [number, number];
  onPriceChange?: (range: [number, number]) => void;
  priceMin?: number;
  priceMax?: number;
  priceStep?: number;
  // Location filter
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
  city?: string;
  onCityChange?: (city: string) => void;
  neighborhood?: string;
  onNeighborhoodChange?: (neighborhood: string) => void;
  // Category filter
  categories?: CategoryOption[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  // Type filter (radio)
  typeOptions?: { value: string; label: string }[];
  selectedType?: string;
  onTypeChange?: (type: string) => void;
  typeLabel?: string;
  // Participants filter
  participantRange?: [number, number];
  onParticipantChange?: (range: [number, number]) => void;
  participantMin?: number;
  participantMax?: number;
  // Time slot filter
  timeSlots?: { time: string; available: boolean; count?: number }[];
  selectedTimeSlot?: string;
  onTimeSlotChange?: (time: string) => void;
  // Rating filter
  selectedRating?: number;
  onRatingChange?: (rating: number) => void;
  // Facility type filter
  facilityTypes?: { value: string; label: string; icon?: React.ReactNode }[];
  selectedFacilityType?: string;
  onFacilityTypeChange?: (type: string) => void;
}

export function MobileFilterBar({
  filters,
  selectedDate,
  onDateChange,
  priceRange = [0, 500],
  onPriceChange,
  priceMin = 0,
  priceMax = 500,
  priceStep = 10,
  selectedLocation = 'all',
  onLocationChange,
  city = '',
  onCityChange,
  neighborhood = '',
  onNeighborhoodChange,
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  typeOptions = [],
  selectedType = 'all',
  onTypeChange,
  typeLabel = 'Type',
  participantRange = [1, 50],
  onParticipantChange,
  participantMin = 1,
  participantMax = 50,
  timeSlots = [],
  selectedTimeSlot,
  onTimeSlotChange,
  selectedRating,
  onRatingChange,
  facilityTypes = [],
  selectedFacilityType = 'all',
  onFacilityTypeChange,
}: MobileFilterBarProps) {
  
  const getFilterValue = (filterType: FilterType): string | undefined => {
    switch (filterType) {
      case 'date':
        return selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined;
      case 'price':
        return priceRange[0] > priceMin || priceRange[1] < priceMax 
          ? `$${priceRange[0]}-$${priceRange[1]}` 
          : undefined;
      case 'location':
        return selectedLocation !== 'all' ? selectedLocation : undefined;
      case 'category':
        return selectedCategories.length > 0 ? `${selectedCategories.length}` : undefined;
      case 'type':
        return selectedType !== 'all' ? selectedType : undefined;
      case 'participants':
        return participantRange[0] > participantMin || participantRange[1] < participantMax
          ? `${participantRange[0]}-${participantRange[1]}`
          : undefined;
      case 'time':
        return selectedTimeSlot ? selectedTimeSlot : undefined;
      case 'rating':
        return selectedRating && selectedRating > 0 ? `${selectedRating}+` : undefined;
      case 'facilityType':
        return selectedFacilityType !== 'all' ? selectedFacilityType : undefined;
      default:
        return undefined;
    }
  };

  const renderFilter = (filterType: FilterType) => {
    switch (filterType) {
      case 'date':
        return (
          <FilterButton
            key="date"
            label="Date"
            value={getFilterValue('date')}
            icon={<CalendarIcon className="w-4 h-4" />}
            onClear={() => onDateChange?.(undefined)}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              className="rounded-md border"
            />
          </FilterButton>
        );

      case 'price':
        return (
          <FilterButton
            key="price"
            label="Price"
            value={getFilterValue('price')}
            icon={<DollarSign className="w-4 h-4" />}
            onClear={() => onPriceChange?.([priceMin, priceMax])}
          >
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="flex items-center justify-between mt-2 mb-4">
                  <span className="text-sm text-muted-foreground">${priceRange[0]}</span>
                  <span className="text-sm text-muted-foreground">${priceRange[1]}</span>
                </div>
                <Slider
                  min={priceMin}
                  max={priceMax}
                  step={priceStep}
                  value={priceRange}
                  onValueChange={(value) => onPriceChange?.(value as [number, number])}
                  className="w-full"
                />
              </div>
            </div>
          </FilterButton>
        );

      case 'location':
        return (
          <FilterButton
            key="location"
            label="Location"
            value={city || neighborhood || getFilterValue('location')}
            icon={<MapPin className="w-4 h-4" />}
            onClear={() => {
              onLocationChange?.('all');
              onCityChange?.('');
              onNeighborhoodChange?.('');
            }}
          >
            <MapFilter
              selectedLocation={selectedLocation}
              onLocationChange={(location) => onLocationChange?.(location)}
              city={city}
              onCityChange={onCityChange}
              neighborhood={neighborhood}
              onNeighborhoodChange={onNeighborhoodChange}
            />
          </FilterButton>
        );

      case 'category':
        return (
          <FilterButton
            key="category"
            label="Categories"
            value={getFilterValue('category')}
            icon={<Tag className="w-4 h-4" />}
            onClear={() => onCategoryChange?.([])}
          >
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Categories</Label>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onCategoryChange?.([...selectedCategories, category.id]);
                        } else {
                          onCategoryChange?.(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`} 
                      className="flex items-center gap-2 font-normal cursor-pointer flex-1"
                    >
                      <span>{category.name}</span>
                      {category.count !== undefined && (
                        <span className="text-xs text-muted-foreground">({category.count})</span>
                      )}
                    </Label>
                    {category.color && (
                      <Badge className={category.color}>{category.count}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FilterButton>
        );

      case 'type':
        return (
          <FilterButton
            key="type"
            label={typeLabel}
            value={getFilterValue('type')}
            icon={<Tag className="w-4 h-4" />}
            onClear={() => onTypeChange?.('all')}
          >
            <div className="space-y-3">
              <Label className="text-sm font-medium">{typeLabel}</Label>
              <RadioGroup value={selectedType} onValueChange={onTypeChange}>
                {typeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`type-${option.value}`} />
                    <Label htmlFor={`type-${option.value}`} className="font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </FilterButton>
        );

      case 'participants':
        return (
          <FilterButton
            key="participants"
            label="Participants"
            value={getFilterValue('participants')}
            icon={<Users className="w-4 h-4" />}
            onClear={() => onParticipantChange?.([participantMin, participantMax])}
          >
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Number of Participants</Label>
                <div className="flex items-center justify-between mt-2 mb-4">
                  <span className="text-sm text-muted-foreground">{participantRange[0]}</span>
                  <span className="text-sm text-muted-foreground">{participantRange[1]}</span>
                </div>
                <Slider
                  min={participantMin}
                  max={participantMax}
                  step={1}
                  value={participantRange}
                  onValueChange={(value) => onParticipantChange?.(value as [number, number])}
                  className="w-full"
                />
              </div>
            </div>
          </FilterButton>
        );

      case 'time':
        return (
          <FilterButton
            key="time"
            label="Time"
            value={getFilterValue('time')}
            icon={<Clock className="w-4 h-4" />}
            onClear={() => onTimeSlotChange?.('')}
          >
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Time Slot</Label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => onTimeSlotChange?.(slot.time)}
                    disabled={!slot.available}
                    className={`
                      p-3 rounded-lg border-2 text-sm transition-all
                      ${selectedTimeSlot === slot.time
                        ? 'border-[#003C66] bg-[#003C66]/5'
                        : slot.available
                        ? 'border-gray-200 hover:border-[#003C66]/30'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    <div className="font-medium">{slot.time}</div>
                    {slot.count !== undefined && slot.available && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {slot.count} available
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FilterButton>
        );

      case 'rating':
        return (
          <FilterButton
            key="rating"
            label="Rating"
            value={getFilterValue('rating')}
            icon={<Star className="w-4 h-4" />}
            onClear={() => onRatingChange?.(0)}
          >
            <div className="space-y-3">
              <Label className="text-sm font-medium">Minimum Rating</Label>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onRatingChange?.(rating)}
                    className={`
                      w-full p-3 rounded-lg border-2 text-sm transition-all flex items-center justify-between
                      ${selectedRating === rating
                        ? 'border-[#003C66] bg-[#003C66]/5'
                        : 'border-gray-200 hover:border-[#003C66]/30'
                      }
                    `}
                  >
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-muted-foreground">& up</span>
                  </button>
                ))}
              </div>
            </div>
          </FilterButton>
        );

      case 'facilityType':
        return (
          <FilterButton
            key="facilityType"
            label="Facility"
            value={getFilterValue('facilityType')}
            icon={<Building2 className="w-4 h-4" />}
            onClear={() => onFacilityTypeChange?.('all')}
          >
            <div className="space-y-3">
              <Label className="text-sm font-medium">Facility Type</Label>
              <RadioGroup value={selectedFacilityType} onValueChange={onFacilityTypeChange}>
                {facilityTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={`facility-${type.value}`} />
                    <Label htmlFor={`facility-${type.value}`} className="font-normal cursor-pointer flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </FilterButton>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:hidden">
      {filters.map(renderFilter)}
    </div>
  );
}