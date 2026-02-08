import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { SlidersHorizontal, X, Star, LayoutGrid, Shirt, Dumbbell, Watch, Apple, Check } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { cn } from '@/app/components/ui/utils';

interface MarketplaceFilterSidebarProps {
  onClose?: () => void;
  onApplyFilters: (filters: FilterState) => void;
  activeProductType?: string;
  onProductTypeChange?: (type: string) => void;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  ratings: number[];
  inStock: boolean;
  onSale: boolean;
}

const BRANDS = ['Nike', 'Adidas', 'Under Armour', 'Decathlon', 'Puma', 'Reebok'];
const RATINGS = [5, 4, 3, 2, 1];

const BRAND_DATA = [
  { 
    name: 'Nike', 
    logo: 'https://images.unsplash.com/photo-1760310032094-1344b3374484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'
  },
  { 
    name: 'Adidas', 
    logo: 'https://images.unsplash.com/photo-1759447916905-5e3f5cc863d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'
  },
  { 
    name: 'Under Armour', 
    logo: 'https://images.unsplash.com/photo-1559278092-640149b5a287?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'
  },
  { 
    name: 'Decathlon', 
    logo: 'https://images.unsplash.com/photo-1756509365454-ef0362a513cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'
  },
  { 
    name: 'Puma', 
    logo: 'https://images.unsplash.com/photo-1758499535896-7be3b226d854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'
  },
  { 
    name: 'Reebok', 
    logo: 'https://images.unsplash.com/photo-1727957019444-a9c99ee0ebb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'
  },
];

export function MarketplaceFilterSidebar({
  onClose,
  onApplyFilters,
  activeProductType,
  onProductTypeChange
}: MarketplaceFilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      brands: selectedBrands,
      ratings: selectedRatings,
      inStock: inStockOnly,
      onSale: onSaleOnly
    });
  };

  const handleReset = () => {
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    onApplyFilters({
      priceRange: [0, 500],
      brands: [],
      ratings: [],
      inStock: false,
      onSale: false
    });
  };

  const activeFiltersCount = 
    selectedBrands.length + 
    selectedRatings.length + 
    (inStockOnly ? 1 : 0) + 
    (onSaleOnly ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0);

  return (
    <Card className="sticky top-24 border-2 max-h-[calc(100vh-120px)] overflow-y-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#003C66]" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        {/* Product Type */}
        {onProductTypeChange && (
          <div className="space-y-3">
            <Label className="font-semibold">Product Type</Label>
            <Tabs value={activeProductType} onValueChange={onProductTypeChange}>
              <TabsList className="inline-flex w-full overflow-x-auto scrollbar-hide gap-1 justify-start">
                <TabsTrigger value="all" className="flex-shrink-0">All</TabsTrigger>
                <TabsTrigger value="clothes" className="flex-shrink-0">
                  <Shirt className="w-4 h-4 mr-1" />
                  Clothes
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex-shrink-0">
                  <Dumbbell className="w-4 h-4 mr-1" />
                  Equipment
                </TabsTrigger>
                <TabsTrigger value="accessories" className="flex-shrink-0">
                  <Watch className="w-4 h-4 mr-1" />
                  Accessories
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="flex-shrink-0">
                  <Apple className="w-4 h-4 mr-1" />
                  Nutrition
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {onProductTypeChange && <Separator />}

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="font-semibold">Price Range</Label>
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              min={0}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div className="space-y-3">
          <Label className="font-semibold">Brands</Label>
          <div className="grid grid-cols-3 gap-3">
            {BRAND_DATA.map((brand) => {
              const isSelected = selectedBrands.includes(brand.name);
              return (
                <button
                  key={brand.name}
                  onClick={() => toggleBrand(brand.name)}
                  className="relative flex flex-col items-center group"
                >
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-2 transition-all",
                    isSelected ? "ring-2 ring-[#003C66]" : "group-hover:ring-2 group-hover:ring-[#003C66]/30"
                  )}>
                    <ImageWithFallback
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-medium text-center leading-tight transition-colors",
                    isSelected ? "text-[#003C66]" : "text-gray-700 group-hover:text-[#003C66]"
                  )}>{brand.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Ratings */}
        <div className="space-y-3">
          <Label className="font-semibold">Customer Ratings</Label>
          <div className="space-y-2">
            {RATINGS.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRatings.includes(rating)}
                  onCheckedChange={() => toggleRating(rating)}
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-normal cursor-pointer flex items-center gap-1"
                >
                  <div className="flex items-center">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">& up</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-3">
          <Label className="font-semibold">Availability</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
              />
              <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={onSaleOnly}
                onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)}
              />
              <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
                On Sale
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleApply}
            className="w-full bg-primary hover:bg-[#002D4D] text-white"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}