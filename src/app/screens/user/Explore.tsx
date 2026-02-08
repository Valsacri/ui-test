import { MOCK_ACTIVITIES, MOCK_GOALS, MOCK_PERSONAL_PROFILE, MOCK_BUSINESS_PROFILES } from '@/app/data/mockData';
import { 
  FACILITIES as MOCK_FACILITIES,
  PRODUCTS as MOCK_PRODUCTS,
  SERVICES as MOCK_SERVICES,
  PEOPLE as MOCK_PEOPLE
} from '@/app/data/exploreData';
import { useState } from 'react';
import { TopBar } from '@/app/components/TopBar';
import { ActivityCard } from '@/app/components/ActivityCard';
import { FacilityCard } from '@/app/components/FacilityCard';
import { ProductCard } from '@/app/components/ProductCard';
import { ServiceCard } from '@/app/components/ServiceCard';
import { PersonCard } from '@/app/components/PersonCard';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { MapPin, Compass, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';
import { MobileFilterBar } from '@/app/components/MobileFilterBar';

interface ExploreProps {
  onActivityClick: (activityId: string) => void;
  onBusinessClick: (businessId: string) => void;
  onGoalClick?: (goalId: string) => void;
  onFacilityClick?: (facilityId: string) => void;
  onProductClick?: (productId: string) => void;
  onServiceClick?: (serviceId: string) => void;
  onPersonClick?: (personId: string) => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
  onSwitchProfile: (type: 'user' | 'business') => void;
  onTabChange?: (tab: 'activities' | 'facilities' | 'products' | 'services' | 'people') => void;
  userType?: 'user' | 'business' | 'squad';
}

export function Explore({
  onActivityClick,
  onBusinessClick,
  onGoalClick,
  onFacilityClick,
  onProductClick,
  onServiceClick,
  onPersonClick,
  onNotifications,
  onMessages,
  onProfile,
  onSwitchProfile,
  onTabChange,
  userType = 'user',
}: ExploreProps) {
  const [activeTab, setActiveTab] = useState('activities');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  
  // Individual filter states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activityType, setActivityType] = useState<'all' | 'solo' | 'squad'>('all');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab as 'activities' | 'facilities' | 'products' | 'services' | 'people');
    }
  };

  const handleItemClick = (type: string, id: string) => {
    if (type === 'activity') {
      onActivityClick(id);
    } else if (type === 'facility') {
      onFacilityClick?.(id);
    } else if (type === 'product') {
      onProductClick?.(id);
    } else if (type === 'service') {
      onServiceClick?.(id);
    } else if (type === 'person') {
      onPersonClick?.(id);
    } else {
      toast(`Opening ${type} details...`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Explore"
          subtitle="Discover activities, facilities, products, and more"
          icon={<Compass className="w-7 h-7 text-[#FC8936]" />}
          filterControls={
            <FilterBar
              inline
              showToggle={false}
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search everything...',
              }}
              filters={[
                {
                  id: 'location',
                  label: 'Location',
                  value: locationFilter,
                  onChange: setLocationFilter,
                  placeholder: 'All Locations',
                  options: [
                    { label: 'All Locations', value: 'all' },
                    { label: 'New York City', value: 'nyc' },
                    { label: 'Manhattan', value: 'manhattan' },
                    { label: 'Brooklyn', value: 'brooklyn' },
                    { label: 'Queens', value: 'queens' },
                  ],
                },
                {
                  id: 'sort',
                  label: 'Sort By',
                  value: sortFilter,
                  onChange: setSortFilter,
                  placeholder: 'Sort By',
                  options: [
                    { label: 'Most Popular', value: 'popular' },
                    { label: 'Nearest', value: 'nearest' },
                    { label: 'Top Rated', value: 'rating' },
                    { label: 'Price: Low to High', value: 'price-low' },
                    { label: 'Price: High to Low', value: 'price-high' },
                  ],
                },
              ]}
              showFilters={showFilters}
              onToggleFilters={setShowFilters}
            />
          }
        >
          {/* Filter Panel */}
          {showFilters && (
            <FilterBar
              filters={[
                {
                  id: 'location',
                  label: 'Location',
                  value: locationFilter,
                  onChange: setLocationFilter,
                  placeholder: 'All Locations',
                  options: [
                    { label: 'All Locations', value: 'all' },
                    { label: 'New York City', value: 'nyc' },
                    { label: 'Manhattan', value: 'manhattan' },
                    { label: 'Brooklyn', value: 'brooklyn' },
                    { label: 'Queens', value: 'queens' },
                  ],
                },
                {
                  id: 'sort',
                  label: 'Sort By',
                  value: sortFilter,
                  onChange: setSortFilter,
                  placeholder: 'Sort By',
                  options: [
                    { label: 'Most Popular', value: 'popular' },
                    { label: 'Nearest', value: 'nearest' },
                    { label: 'Top Rated', value: 'rating' },
                    { label: 'Price: Low to High', value: 'price-low' },
                    { label: 'Price: High to Low', value: 'price-high' },
                  ],
                },
              ]}
              showFilters={true}
              showToggle={false}
            />
          )}

          {/* Tabs */}
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="activities" className="text-xs">Activities</TabsTrigger>
                <TabsTrigger value="facilities" className="text-xs">Facilities</TabsTrigger>
                <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
                <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
                <TabsTrigger value="people" className="text-xs">People</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </PageHeader>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab}>
          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {MOCK_ACTIVITIES.length} activities near you
              </p>
              <Button variant="ghost" size="sm" className="gap-2 hidden lg:flex">
                <MapPin className="w-4 h-4" />
                Map View
              </Button>
            </div>

            {/* Mobile Filter Buttons - Only show on mobile */}
            <MobileFilterBar
              filters={['date', 'price', 'type', 'location']}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              priceMin={0}
              priceMax={500}
              priceStep={10}
              typeOptions={[
                { value: 'all', label: 'All Activities' },
                { value: 'solo', label: 'Solo Activities' },
                { value: 'squad', label: 'Squad Activities' },
              ]}
              selectedType={activityType}
              onTypeChange={(value) => setActivityType(value as any)}
              typeLabel="Activity Type"
              selectedLocation={locationFilter}
              onLocationChange={setLocationFilter}
              city={city}
              onCityChange={setCity}
              neighborhood={neighborhood}
              onNeighborhoodChange={setNeighborhood}
            />
            
            <div className="space-y-3">
              {MOCK_ACTIVITIES.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  {...activity}
                  onClick={() => handleItemClick('activity', activity.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {MOCK_FACILITIES.length} facilities available
              </p>
              <Button variant="ghost" size="sm" className="gap-2">
                <MapPin className="w-4 h-4" />
                Map View
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_FACILITIES.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  {...facility}
                  onClick={() => handleItemClick('facility', facility.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {MOCK_PRODUCTS.length} products available
              </p>
              <Select defaultValue="popular">
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="new">New Arrivals</SelectItem>
                  <SelectItem value="sale">On Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onClick={() => handleItemClick('product', product.id)}
                  userType={userType}
                />
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {MOCK_SERVICES.length} services available
              </p>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="recovery">Recovery</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="classes">Classes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_SERVICES.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  onClick={() => handleItemClick('service', service.id)}
                  userType={userType}
                />
              ))}
            </div>
          </TabsContent>

          {/* People Tab */}
          <TabsContent value="people" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {MOCK_PEOPLE.length} athletes to connect with
              </p>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="cycling">Cycling</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              {MOCK_PEOPLE.map((person) => (
                <PersonCard
                  key={person.id}
                  {...person}
                  onClick={() => handleItemClick('person', person.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}