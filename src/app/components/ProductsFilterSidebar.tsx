import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { DollarSign, ShoppingBag, Star, Package } from 'lucide-react';
import { useState } from 'react';
import { MapFilter } from '@/app/components/MapFilter';

interface ProductsFilterSidebarProps {
  onPriceRangeChange?: (range: [number, number]) => void;
  onConditionChange?: (conditions: string[]) => void;
  onRatingChange?: (ratings: string[]) => void;
  onCategoryChange?: (categories: string[]) => void;
}

export function ProductsFilterSidebar({
  onPriceRangeChange,
  onConditionChange,
  onRatingChange,
  onCategoryChange,
}: ProductsFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { id: 'equipment', name: 'Equipment', count: 156 },
    { id: 'apparel', name: 'Apparel', count: 234 },
    { id: 'accessories', name: 'Accessories', count: 89 },
    { id: 'nutrition', name: 'Nutrition', count: 67 },
    { id: 'tech', name: 'Tech & Gadgets', count: 45 },
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const ratings = ['4+ Stars', '3+ Stars', '2+ Stars'];

  const handlePriceRangeChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setPriceRange(range);
    onPriceRangeChange?.(range);
  };

  const handleConditionToggle = (condition: string) => {
    const updated = selectedConditions.includes(condition)
      ? selectedConditions.filter(c => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(updated);
    onConditionChange?.(updated);
  };

  const handleRatingToggle = (rating: string) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
    onRatingChange?.(updated);
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
          Find the perfect sports products
        </p>
      </div>

      <Separator />

      {/* Categories */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Categories</h4>
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

      {/* Condition */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-4 h-4 text-[#FC8936]" />
          <h4 className="font-semibold text-sm">Condition</h4>
        </div>
        <div className="space-y-3">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition.toLowerCase().replace(' ', '-')}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={() => handleConditionToggle(condition)}
              />
              <Label
                htmlFor={condition.toLowerCase().replace(' ', '-')}
                className="cursor-pointer font-normal text-sm"
              >
                {condition}
              </Label>
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
                id={rating.toLowerCase().replace(/\+|\s/g, '-')}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => handleRatingToggle(rating)}
              />
              <Label
                htmlFor={rating.toLowerCase().replace(/\+|\s/g, '-')}
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
        title="Seller Location"
        defaultDistance={25}
        minDistance={1}
        maxDistance={100}
        onDistanceChange={(distance) => console.log('Distance changed:', distance)}
        onViewMap={() => console.log('View map clicked')}
        onUseMyLocation={() => console.log('Use my location clicked')}
      />
    </div>
  );
}
