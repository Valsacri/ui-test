import { Card } from '@/app/components/ui/card';
import { Slider } from '@/app/components/ui/slider';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface MapFilterProps {
  title?: string;
  defaultDistance?: number;
  minDistance?: number;
  maxDistance?: number;
  onDistanceChange?: (distance: number) => void;
  onViewMap?: () => void;
  onUseMyLocation?: () => void;
  selectedLocation?: string;
  onLocationChange?: (location: string) => void;
  city?: string;
  onCityChange?: (city: string) => void;
  neighborhood?: string;
  onNeighborhoodChange?: (neighborhood: string) => void;
}

export function MapFilter({
  title = 'Location & Distance',
  defaultDistance = 10,
  minDistance = 1,
  maxDistance = 50,
  onDistanceChange,
  onViewMap,
  onUseMyLocation,
  selectedLocation,
  onLocationChange,
  city = '',
  onCityChange,
  neighborhood = '',
  onNeighborhoodChange,
}: MapFilterProps) {
  const [distance, setDistance] = useState<number>(defaultDistance);
  const [isUsingLocation, setIsUsingLocation] = useState(false);
  const [localCity, setLocalCity] = useState(city);
  const [localNeighborhood, setLocalNeighborhood] = useState(neighborhood);

  const handleDistanceChange = (value: number[]) => {
    setDistance(value[0]);
    onDistanceChange?.(value[0]);
  };

  const handleUseMyLocation = () => {
    setIsUsingLocation(true);
    onUseMyLocation?.();
    // Simulate location detection
    setTimeout(() => {
      setIsUsingLocation(false);
    }, 1000);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setLocalCity(newCity);
    onCityChange?.(newCity);
  };

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNeighborhood = e.target.value;
    setLocalNeighborhood(newNeighborhood);
    onNeighborhoodChange?.(newNeighborhood);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-[#FC8936]" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>

      {/* City and Neighborhood Input */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={localCity}
            onChange={handleCityChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            id="neighborhood"
            value={localNeighborhood}
            onChange={handleNeighborhoodChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Static Map Preview */}
      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 h-[200px] bg-gray-100 relative">
        {/* Placeholder for map - using a simple visual representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Center marker */}
            <div className="w-3 h-3 bg-primary rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 border-2 border-white shadow-lg" />
            {/* Radius circle visualization */}
            <div 
              className="rounded-full border-2 border-[#FC8936] bg-[#FC8936]/10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                width: `${Math.min(distance * 4, 180)}px`,
                height: `${Math.min(distance * 4, 180)}px`,
              }}
            />
          </div>
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Use My Location Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleUseMyLocation}
        disabled={isUsingLocation}
        className="w-full mb-4 hover:border-[#FC8936] hover:text-[#FC8936]"
      >
        <Navigation className={`w-3.5 h-3.5 mr-2 ${isUsingLocation ? 'animate-pulse' : ''}`} />
        {isUsingLocation ? 'Detecting location...' : 'Use my current location'}
      </Button>

      {/* Distance Slider */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Search radius</span>
            <Badge variant="secondary" className="text-xs">
              {distance} {distance === 1 ? 'mile' : 'miles'}
            </Badge>
          </div>
          <Slider
            min={minDistance}
            max={maxDistance}
            step={1}
            value={[distance]}
            onValueChange={handleDistanceChange}
            className="w-full"
          />
        </div>

        {/* Distance Range Labels */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{minDistance} mi</span>
          <span>{maxDistance} mi</span>
        </div>
      </div>

      {/* View on Map Button */}
      {onViewMap && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewMap}
          className="w-full mt-4 text-[#003C66] hover:text-[#003C66] hover:bg-primary/5"
        >
          <Maximize2 className="w-3.5 h-3.5 mr-2" />
          View results on map
        </Button>
      )}

      {/* Location Preview */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#FC8936] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900">
              Current Location
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              San Francisco, CA
            </p>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-[#003C66] hover:text-[#FC8936] mt-1"
            >
              Change location
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}