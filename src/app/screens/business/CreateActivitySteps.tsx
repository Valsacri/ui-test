import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Calendar } from '@/app/components/ui/calendar';
import { Badge } from '@/app/components/ui/badge';
import { 
  SPORTS, 
  EXPERIENCE_LEVELS,
  MOCK_BUSINESS_FACILITIES,
  MOCK_BUSINESS_PRODUCTS,
  MOCK_BUSINESS_SERVICES
} from '@/app/data/mockData';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MapPin,
  Calendar as CalendarIcon,
  Users,
  DollarSign,
  Package,
  Image as ImageIcon,
  Upload,
  Trophy,
  Star,
  Crown,
  Award,
  Shirt,
  Megaphone,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MapView } from '@/app/components/MapView';
import { SponsorshipTierBuilder, SponsorshipTier } from '@/app/components/SponsorshipTierBuilder';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CreateActivityStepsProps {
  onBack: () => void;
  onSubmit: () => void;
}

interface ActivityFormData {
  title: string;
  sport: string;
  level: string;
  description: string;
  location: {
    address: string;
    city: string;
    neighborhood: string;
    lat: number;
    lng: number;
  };
  date?: Date;
  time: string;
  duration: number;
  maxParticipants: number;
  price: number;
  selectedResources: string[];
  customTiers: SponsorshipTier[];
  eventPoster?: string;
}

const CITIES = [
  { id: 'nyc', name: 'New York City' },
  { id: 'manhattan', name: 'Manhattan' },
  { id: 'brooklyn', name: 'Brooklyn' },
  { id: 'queens', name: 'Queens' },
  { id: 'bronx', name: 'Bronx' },
];

const NEIGHBORHOODS = {
  manhattan: ['Upper East Side', 'Upper West Side', 'Midtown', 'Greenwich Village', 'SoHo', 'Tribeca'],
  brooklyn: ['Williamsburg', 'Park Slope', 'DUMBO', 'Brooklyn Heights', 'Bushwick'],
  queens: ['Astoria', 'Long Island City', 'Flushing', 'Forest Hills'],
  bronx: ['Riverdale', 'Fordham', 'Pelham Bay', 'Concourse'],
};

const STEPS = [
  { id: 1, name: 'Basic Info', icon: ImageIcon },
  { id: 2, name: 'Location', icon: MapPin },
  { id: 3, name: 'Schedule', icon: CalendarIcon },
  { id: 4, name: 'Resources', icon: Package },
  { id: 5, name: 'Sponsorship', icon: Trophy },
  { id: 6, name: 'Review', icon: Check },
];

export function CreateActivitySteps({ onBack, onSubmit }: CreateActivityStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isActivityDetailsCollapsed, setIsActivityDetailsCollapsed] = useState(true);
  const [formData, setFormData] = useState<ActivityFormData>({
    title: '',
    sport: '',
    level: '',
    description: '',
    location: {
      address: '',
      city: '',
      neighborhood: '',
      lat: 40.7580,
      lng: -73.9855,
    },
    time: '',
    duration: 1,
    maxParticipants: 10,
    price: 0,
    selectedResources: [],
    customTiers: [],
  });

  const allResources = [
    ...MOCK_BUSINESS_FACILITIES,
    ...MOCK_BUSINESS_PRODUCTS,
    ...MOCK_BUSINESS_SERVICES,
  ];

  const updateFormData = (updates: Partial<ActivityFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleResource = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedResources: prev.selectedResources.includes(id)
        ? prev.selectedResources.filter(r => r !== id)
        : [...prev.selectedResources, id]
    }));
  };

  const calculateTotalCost = () => {
    return formData.selectedResources.reduce((total, resourceId) => {
      const resource = allResources.find(r => r.id === resourceId);
      if (!resource) return total;
      if ('pricePerHour' in resource) {
        return total + resource.pricePerHour;
      }
      return total + resource.price;
    }, 0);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.sport && formData.level;
      case 2:
        return formData.location.address && formData.location.city;
      case 3:
        return formData.date && formData.time;
      case 4:
        return formData.maxParticipants > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    toast.success('Activity created successfully!');
    onSubmit();
  };

  const selectedCity = CITIES.find(c => c.id === formData.location.city);
  const availableNeighborhoods = formData.location.city 
    ? NEIGHBORHOODS[formData.location.city as keyof typeof NEIGHBORHOODS] || []
    : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold">Create New Activity</h1>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-primary text-white'
                            : isCurrent
                            ? 'bg-secondary/10 text-[#FC8936] border-2 border-[#FC8936]'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1 hidden sm:block ${
                          isCurrent ? 'font-medium text-[#FC8936]' : 'text-muted-foreground'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          isCompleted ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Tell us about your activity</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Morning Yoga Session"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport Type *</Label>
                    <Select value={formData.sport} onValueChange={(value) => updateFormData({ sport: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPORTS.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.icon} {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Experience Level *</Label>
                    <Select value={formData.level} onValueChange={(value) => updateFormData({ level: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your activity, what participants can expect, what to bring..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                  />
                </div>

                {/* Capacity and Pricing */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Capacity & Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-participants">
                        <Users className="w-4 h-4 inline mr-1" />
                        Maximum Participants *
                      </Label>
                      <Input
                        id="max-participants"
                        type="number"
                        min="1"
                        placeholder="e.g., 20"
                        value={formData.maxParticipants}
                        onChange={(e) => updateFormData({ maxParticipants: Number(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Price per Person ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => updateFormData({ price: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Set to $0 for free activities
                      </p>
                    </div>
                  </div>

                  {/* Revenue Estimate */}
                  {formData.maxParticipants > 0 && formData.price > 0 && (
                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Potential Revenue</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                          ${(formData.price * formData.maxParticipants).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on full capacity of {formData.maxParticipants} participants at ${formData.price} each
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Location</h2>
                <p className="text-sm text-muted-foreground">Where will this activity take place?</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select 
                      value={formData.location.city} 
                      onValueChange={(value) => updateFormData({ 
                        location: { ...formData.location, city: value, neighborhood: '' }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {availableNeighborhoods.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Neighborhood</Label>
                      <Select 
                        value={formData.location.neighborhood}
                        onValueChange={(value) => updateFormData({ 
                          location: { ...formData.location, neighborhood: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select neighborhood" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableNeighborhoods.map((neighborhood) => (
                            <SelectItem key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter street address"
                    value={formData.location.address}
                    onChange={(e) => updateFormData({ 
                      location: { ...formData.location, address: e.target.value }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Click on the map to set the exact location
                  </p>
                </div>

                {/* Map */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-2 border-b flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {selectedCity ? selectedCity.name : 'Select location on map'}
                    </span>
                  </div>
                  <MapView
                    center={[formData.location.lat, formData.location.lng]}
                    zoom={13}
                    markers={[{
                      position: [formData.location.lat, formData.location.lng],
                      title: formData.title || 'Activity Location',
                      description: formData.location.address
                    }]}
                    height="300px"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Schedule</h2>
                <p className="text-sm text-muted-foreground">When will this activity happen?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Date *</Label>
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => updateFormData({ date })}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Start Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => updateFormData({ time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.duration}
                      onChange={(e) => updateFormData({ duration: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {formData.date && formData.time && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Activity Schedule</p>
                    <p className="text-sm text-blue-700">
                      {format(formData.date, 'EEEE, MMMM dd, yyyy')} at {formData.time}
                      {formData.duration > 1 && ` (${formData.duration} hours)`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Resources */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Resources & Amenities</h2>
                <p className="text-sm text-muted-foreground">Select facilities, products, and services</p>
              </div>

              <div className="space-y-6">
                {/* Facilities */}
                <div>
                  <h3 className="font-medium mb-3">Facilities</h3>
                  <div className="space-y-2">
                    {MOCK_BUSINESS_FACILITIES.map((facility) => (
                      <div
                        key={facility.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={formData.selectedResources.includes(facility.id)}
                            onCheckedChange={() => toggleResource(facility.id)}
                          />
                          <div>
                            <p className="font-medium">{facility.name}</p>
                            <p className="text-sm text-muted-foreground">{facility.type}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          ${facility.pricePerHour}/hr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="font-medium mb-3">Products</h3>
                  <div className="space-y-2">
                    {MOCK_BUSINESS_PRODUCTS.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={formData.selectedResources.includes(product.id)}
                            onCheckedChange={() => toggleResource(product.id)}
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.type}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          ${product.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="font-medium mb-3">Services</h3>
                  <div className="space-y-2">
                    {MOCK_BUSINESS_SERVICES.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={formData.selectedResources.includes(service.id)}
                            onCheckedChange={() => toggleResource(service.id)}
                          />
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.type}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          ${service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Summary */}
                {formData.selectedResources.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Estimated Cost</span>
                      <span className="text-lg">${calculateTotalCost()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Selected Resources</span>
                      <span>{formData.selectedResources.length} items</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Sponsorship */}
        {currentStep === 5 && (
          <div className="space-y-4">
            {/* Collapsible Activity Details Summary */}
            <Card>
              <CardContent className="p-0">
                <button
                  onClick={() => setIsActivityDetailsCollapsed(!isActivityDetailsCollapsed)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">Activity Details</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.title || 'Untitled Activity'} • {formData.date ? format(formData.date, 'MMM dd') : 'No date'}
                      </p>
                    </div>
                  </div>
                  {isActivityDetailsCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {!isActivityDetailsCollapsed && (
                  <div className="p-4 pt-0 space-y-4 border-t">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#FC8936]" />
                        Basic Information
                      </h4>
                      <div className="pl-6 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Title:</span>
                          <span className="font-medium">{formData.title || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sport:</span>
                          <span className="font-medium">
                            {SPORTS.find(s => s.id === formData.sport)?.name || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Level:</span>
                          <span className="font-medium">
                            {EXPERIENCE_LEVELS.find(l => l.id === formData.level)?.label || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacity:</span>
                          <span className="font-medium">{formData.maxParticipants} participants</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">
                            {formData.price > 0 ? `$${formData.price}` : 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="pt-3 border-t">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FC8936]" />
                        Location
                      </h4>
                      <div className="pl-6 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">City:</span>
                          <span className="font-medium">
                            {CITIES.find(c => c.id === formData.location.city)?.name || 'Not set'}
                          </span>
                        </div>
                        {formData.location.neighborhood && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Neighborhood:</span>
                            <span className="font-medium">{formData.location.neighborhood}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-medium text-right ml-4">
                            {formData.location.address || 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="pt-3 border-t">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#FC8936]" />
                        Schedule
                      </h4>
                      <div className="pl-6 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">
                            {formData.date ? format(formData.date, 'EEEE, MMMM dd, yyyy') : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{formData.time || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">
                            {formData.duration} hour{formData.duration > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    {formData.selectedResources.length > 0 && (
                      <div className="pt-3 border-t">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#FC8936]" />
                          Resources
                        </h4>
                        <div className="pl-6 space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Selected:</span>
                            <span className="font-medium">
                              {formData.selectedResources.length} item{formData.selectedResources.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Cost:</span>
                            <span className="font-medium">${calculateTotalCost()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sponsorship Configuration */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Sponsorship Visibility Tiers</h2>
                  <p className="text-sm text-muted-foreground">Create custom sponsorship tiers with visual logo placements</p>
                </div>

                <SponsorshipTierBuilder
                  tiers={formData.customTiers}
                  onChange={(tiers) => updateFormData({ customTiers: tiers })}
                  eventPoster={formData.eventPoster}
                  onPosterUpload={(url) => updateFormData({ eventPoster: url })}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 6 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Review & Publish</h2>
                <p className="text-sm text-muted-foreground">Review your activity before publishing</p>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sport:</span>
                      <span className="font-medium">
                        {SPORTS.find(s => s.id === formData.sport)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium">
                        {EXPERIENCE_LEVELS.find(l => l.id === formData.level)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Max Participants:</span>
                      <span className="font-medium">{formData.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">
                        {formData.price > 0 ? `$${formData.price}` : 'Free'}
                      </span>
                    </div>
                    {formData.price > 0 && (
                      <div className="flex justify-between bg-green-50 p-2 rounded">
                        <span className="text-green-700 font-medium">Potential Revenue:</span>
                        <span className="font-bold text-green-600">
                          ${(formData.price * formData.maxParticipants).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Location</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span className="font-medium">
                        {CITIES.find(c => c.id === formData.location.city)?.name}
                      </span>
                    </div>
                    {formData.location.neighborhood && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Neighborhood:</span>
                        <span className="font-medium">{formData.location.neighborhood}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium">{formData.location.address}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Schedule</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {formData.date ? format(formData.date, 'MMMM dd, yyyy') : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{formData.duration} hour{formData.duration > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Resources */}
                {formData.selectedResources.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Selected Resources</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        {formData.selectedResources.length} resource{formData.selectedResources.length > 1 ? 's' : ''} selected
                      </p>
                      <p className="font-medium">
                        Estimated cost: ${calculateTotalCost()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sponsorship */}
                {formData.customTiers.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Sponsorship Tiers</h3>
                    <div className="space-y-3">
                      {formData.customTiers.map(tier => (
                        <div key={tier.id} className="border-l-4 border-[#FC8936] pl-3 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{tier.name}</p>
                              <p className="text-sm text-primary font-semibold">${tier.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <p className="font-medium text-muted-foreground">Logo Placements:</p>
                            <div className="flex flex-wrap gap-1">
                              {tier.logoPositions.map(pos => (
                                <Badge key={pos} variant="secondary" className="text-xs">
                                  {pos.replace('jersey-', '').replace('poster-', '').replace(/-/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                            {tier.benefits.length > 0 && (
                              <>
                                <p className="font-medium text-muted-foreground mt-2">Benefits:</p>
                                <ul className="text-muted-foreground">
                                  {tier.benefits.filter(b => b).slice(0, 3).map((benefit, idx) => (
                                    <li key={idx}>• {benefit}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900">Total Sponsorship Potential</span>
                          <span className="text-lg font-bold text-blue-900">
                            ${formData.customTiers.reduce((sum, t) => sum + t.price, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>
          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Create Activity
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}