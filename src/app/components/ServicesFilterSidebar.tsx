import { Calendar } from '@/app/components/ui/calendar';
import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Badge } from '@/app/components/ui/badge';
import { Calendar as CalendarIcon, DollarSign, Wrench, Star } from 'lucide-react';
import { useState } from 'react';
import { MapFilter } from '@/app/components/MapFilter';

interface ServicesFilterSidebarProps {
  onDateChange?: (date: Date | undefined) => void;
  onPriceRangeChange?: (range: [number, number]) => void;
  onServiceTypeChange?: (types: string[]) => void;
  onCategoryChange?: (categories: string[]) => void;
}

export function ServicesFilterSidebar({
  onDateChange,
  onPriceRangeChange,
  onServiceTypeChange,
  onCategoryChange,
}: ServicesFilterSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const serviceTypes = ['One-on-One', 'Group Sessions', 'Online', 'In-Person'];
  
  const categories = [
    { id: 'coaching', name: 'Coaching', count: 45 },
    { id: 'training', name: 'Personal Training', count: 67 },
    { id: 'nutrition', name: 'Nutrition', count: 32 },
    { id: 'physio', name: 'Physiotherapy', count: 28 },
    { id: 'wellness', name: 'Wellness', count: 41 },
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

  const handleServiceTypeToggle = (type: string) => {
    const updated = selectedServiceTypes.includes(type)
      ? selectedServiceTypes.filter(t => t !== type)
      : [...selectedServiceTypes, type];
    setSelectedServiceTypes(updated);
    onServiceTypeChange?.(updated);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updated);
    onCategoryChange?.(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Find the right service provider
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
      </Card>

      <Separator />

      {/* Service Categories */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Service Category</h4>
        </div>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <Label htmlFor={category.id} className="cursor-pointer font-normal">
                  {category.name}
                </Label>
              </div>
              <Badge variant="outline" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      {/* Service Type */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Service Type</h4>
        </div>
        <div className="space-y-3">
          {serviceTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type.toLowerCase().replace(/\s|-/g, '-')}
                checked={selectedServiceTypes.includes(type)}
                onCheckedChange={() => handleServiceTypeToggle(type)}
              />
              <Label
                htmlFor={type.toLowerCase().replace(/\s|-/g, '-')}
                className="cursor-pointer font-normal text-sm"
              >
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
            step={10}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              ${priceRange[0]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ${priceRange[1]}
            </Badge>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Map Filter */}
      <MapFilter
        title="Location & Distance"
        defaultDistance={15}
        minDistance={1}
        maxDistance={50}
        onDistanceChange={(distance) => console.log('Distance changed:', distance)}
        onViewMap={() => console.log('View map clicked')}
        onUseMyLocation={() => console.log('Use my location clicked')}
      />
    </div>
  );
}
