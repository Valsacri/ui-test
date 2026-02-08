import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Building2, Star, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { MapFilter } from '@/app/components/MapFilter';

interface BusinessesFilterSidebarProps {
  onBusinessTypeChange?: (type: string) => void;
  onCategoryChange?: (categories: string[]) => void;
  onRatingChange?: (ratings: string[]) => void;
}

export function BusinessesFilterSidebar({
  onBusinessTypeChange,
  onCategoryChange,
  onRatingChange,
}: BusinessesFilterSidebarProps) {
  const [businessType, setBusinessType] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  const categories = [
    { id: 'gym', name: 'Gyms & Fitness Centers', count: 48 },
    { id: 'sports-complex', name: 'Sports Complexes', count: 32 },
    { id: 'coaching', name: 'Coaching Services', count: 67 },
    { id: 'retail', name: 'Sports Retail', count: 45 },
    { id: 'wellness', name: 'Wellness Centers', count: 39 },
  ];

  const ratings = ['4+ Stars', '3+ Stars', '2+ Stars'];

  const handleBusinessTypeChange = (value: string) => {
    setBusinessType(value);
    onBusinessTypeChange?.(value);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updated);
    onCategoryChange?.(updated);
  };

  const handleRatingToggle = (rating: string) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
    onRatingChange?.(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Discover sports businesses
        </p>
      </div>

      <Separator />

      {/* Business Type */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Business Type</h4>
        </div>
        <RadioGroup value={businessType} onValueChange={handleBusinessTypeChange}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-businesses" />
              <Label htmlFor="all-businesses" className="cursor-pointer font-normal">
                All Businesses
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="facilities" id="facilities" />
              <Label htmlFor="facilities" className="cursor-pointer font-normal">
                Facilities
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="services" id="services" />
              <Label htmlFor="services" className="cursor-pointer font-normal">
                Service Providers
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="retail" id="retail" />
              <Label htmlFor="retail" className="cursor-pointer font-normal">
                Retail Stores
              </Label>
            </div>
          </div>
        </RadioGroup>
      </Card>

      <Separator />

      {/* Categories */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Category</h4>
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
                <Label htmlFor={category.id} className="cursor-pointer font-normal text-sm">
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

      {/* Rating */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Rating</h4>
        </div>
        <div className="space-y-3">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`business-${rating.toLowerCase().replace(/\+|\s/g, '-')}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => handleRatingToggle(rating)}
              />
              <Label
                htmlFor={`business-${rating.toLowerCase().replace(/\+|\s/g, '-')}`}
                className="cursor-pointer font-normal text-sm"
              >
                {rating}
              </Label>
            </div>
          ))}
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
