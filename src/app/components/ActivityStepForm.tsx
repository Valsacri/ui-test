import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  Target, Dumbbell, Trophy, Activity, Calendar, Tent, Mountain, Award,
  Building2, MapPin, ImageIcon, ChevronLeft, ChevronRight, DollarSign, Users, Star, Eye, Sparkles,
  Package, Search, ShoppingCart, Check, Shirt, ShieldCheck, Utensils, Camera, Music, HeartPulse, Radio, Megaphone, Upload, Printer, UserCheck, Instagram, Twitter, Facebook, Youtube, Globe
} from 'lucide-react';
import { 
  ACTIVITY_TYPES, SPORTS, EXPERIENCE_LEVELS, MOCK_BUSINESS_FACILITIES, MOCK_STAFF_MEMBERS,
  MOCK_MARKETPLACE_PRODUCTS, MOCK_MARKETPLACE_SERVICES, MOCK_BUSINESS_PRODUCTS, MOCK_BUSINESS_SERVICES,
  MOCK_ATHLETES_INFLUENCERS
} from '../data/mockData';
import { DateTimePicker } from './DateTimePicker';
import { ResourceCarousel } from './ResourceCarousel';
import { AthleteCollaborationSelector } from './AthleteCollaborationSelector';
import { CommunicationPhaseContent } from './CommunicationPhaseContent';
import { SponsoredEventModal } from './SponsoredEventForm/SponsoredEventModal';

interface ActivityStepFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  onMetricsChange?: (metrics: {
    preEventReach: number;
    duringEventReach: number;
    postEventReach: number;
    expectedAttendance: number;
    maxCapacity: number;
  }) => void;
}

const getActivityIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Target, Dumbbell, Trophy, Activity, Calendar, Tent, Mountain, Award
  };
  return icons[iconName] || Target;
};

export function ActivityStepForm({ onCancel, onSubmit, onMetricsChange }: ActivityStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActivityType, setSelectedActivityType] = useState('session');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [locationType, setLocationType] = useState<'facility' | 'custom'>('facility');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [customLocation, setCustomLocation] = useState({ name: '', address: '', lat: 40.7589, lng: -73.9851 });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSponsoredEvent, setIsSponsoredEvent] = useState(false);
  const [isSponsoredEventModalOpen, setIsSponsoredEventModalOpen] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [instructors, setInstructors] = useState<string[]>([]);
  const [instructorInput, setInstructorInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sponsorshipSubStep, setSponsorshipSubStep] = useState(1);
  const [isSponsorshipExpanded, setIsSponsorshipExpanded] = useState(false);
  
  // Event Resources & Budget state
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [marketplaceSearchQuery, setMarketplaceSearchQuery] = useState('');
  const [resourceCategory, setResourceCategory] = useState<string>('all');
  const [eventBudget, setEventBudget] = useState<number>(0);
  const [sponsorshipGoal, setSponsorshipGoal] = useState<number>(0);
  
  // Print Media state
  const [preEventPrintMedia, setPreEventPrintMedia] = useState(false);
  const [duringEventPrintMedia, setDuringEventPrintMedia] = useState(false);
  const [postEventPrintMedia, setPostEventPrintMedia] = useState(false);
  
  // Athlete/Influencer Collaboration state
  const [preEventAthleteCollab, setPreEventAthleteCollab] = useState(false);
  const [duringEventAthleteCollab, setDuringEventAthleteCollab] = useState(false);
  const [postEventAthleteCollab, setPostEventAthleteCollab] = useState(false);
  const [athleteSearchQuery, setAthleteSearchQuery] = useState('');
  const [selectedAthletes, setSelectedAthletes] = useState<{
    pre?: any;
    during?: any;
    post?: any;
  }>({});
  const [athleteDeliverables, setAthleteDeliverables] = useState<{
    pre: string[];
    during: string[];
    post: string[];
  }>({
    pre: [],
    during: [],
    post: []
  });
  
  // Communication Timeline tab state
  const [activeCommPhase, setActiveCommPhase] = useState<'pre' | 'during' | 'post'>('pre');

  // Calculate metrics whenever relevant state changes
  useEffect(() => {
    if (!onMetricsChange) return;

    // Calculate reach based on athletes/influencers and their followers
    let preEventReach = 0;
    let duringEventReach = 0;
    let postEventReach = 0;

    // Pre-event reach
    if (preEventAthleteCollab && selectedAthletes.pre) {
      const athlete = selectedAthletes.pre;
      const reachPercentage = athlete.reach / 100;
      preEventReach += Math.round(athlete.followers * reachPercentage);
    }
    // Add print media bonus (estimated 10K reach per print media campaign)
    if (preEventPrintMedia) {
      preEventReach += 10000;
    }

    // During event reach
    if (duringEventAthleteCollab && selectedAthletes.during) {
      const athlete = selectedAthletes.during;
      const reachPercentage = athlete.reach / 100;
      duringEventReach += Math.round(athlete.followers * reachPercentage);
    }
    if (duringEventPrintMedia) {
      duringEventReach += 10000;
    }
    // Add in-person attendance to during event reach
    if (maxParticipants > 0) {
      duringEventReach += maxParticipants;
    }

    // Post-event reach
    if (postEventAthleteCollab && selectedAthletes.post) {
      const athlete = selectedAthletes.post;
      const reachPercentage = athlete.reach / 100;
      postEventReach += Math.round(athlete.followers * reachPercentage);
    }
    if (postEventPrintMedia) {
      postEventReach += 10000;
    }

    // Calculate expected attendance (70% of max capacity as estimate)
    const expectedAttendance = maxParticipants > 0 ? Math.round(maxParticipants * 0.7) : 0;

    onMetricsChange({
      preEventReach,
      duringEventReach,
      postEventReach,
      expectedAttendance,
      maxCapacity: maxParticipants || 0,
    });
  }, [
    preEventAthleteCollab,
    duringEventAthleteCollab,
    postEventAthleteCollab,
    selectedAthletes,
    preEventPrintMedia,
    duringEventPrintMedia,
    postEventPrintMedia,
    maxParticipants,
    onMetricsChange,
  ]);

  const getTotalSteps = () => {
    const hasTypeSpecificFields = ['workout', 'match', 'training', 'program', 'camp', 'adventure', 'tournament'].includes(selectedActivityType);
    return hasTypeSpecificFields ? 4 : 3; // Reduced from 5/4 to 4/3 by adding image to step 1
  };

  const potentialRevenue = maxParticipants && price ? maxParticipants * price : 0;

  const handleNext = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleAddInstructor = () => {
    if (instructorInput.trim() && !instructors.includes(instructorInput.trim())) {
      setInstructors([...instructors, instructorInput.trim()]);
      setInstructorInput('');
    }
  };

  const handleRemoveInstructor = (instructorName: string) => {
    setInstructors(instructors.filter(i => i !== instructorName));
  };

  const handleSelectStaffMember = (staffMember: typeof MOCK_STAFF_MEMBERS[0]) => {
    const instructorName = staffMember.name;
    if (!instructors.includes(instructorName)) {
      setInstructors([...instructors, instructorName]);
    }
  };

  // Filter staff members by search query (name or email)
  const filteredStaffMembers = MOCK_STAFF_MEMBERS.filter(staff => {
    const query = searchQuery.toLowerCase();
    return (
      staff.name.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.role.toLowerCase().includes(query)
    );
  });

  // Get all available resources (own + marketplace) - excluding facilities (handled in activity creation)
  const allAvailableResources = [
    ...MOCK_BUSINESS_PRODUCTS,
    ...MOCK_BUSINESS_SERVICES,
    ...MOCK_MARKETPLACE_PRODUCTS,
    ...MOCK_MARKETPLACE_SERVICES,
  ];

  // Toggle resource selection
  const toggleResource = (resourceId: string) => {
    setSelectedResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Calculate total event budget from selected resources
  const calculateTotalBudget = () => {
    return selectedResources.reduce((total, resourceId) => {
      const resource = allAvailableResources.find(r => r.id === resourceId);
      if (!resource) return total;
      return total + (resource.price || resource.pricePerHour || 0);
    }, 0);
  };

  const totalBudget = calculateTotalBudget();
  const budgetCoverage = sponsorshipGoal > 0 && totalBudget > 0 ? Math.min(100, (sponsorshipGoal / totalBudget) * 100) : 0;

  // Calculate budget breakdown by category
  const calculateBudgetBreakdown = () => {
    const breakdown = {
      facilities: 0,
      staff: 0,
      products: 0,
      services: 0,
      media: 0,
      safety: 0,
      entertainment: 0,
      foodBeverage: 0,
    };

    // Add facility cost (pricePerHour * duration)
    if (selectedFacility && duration > 0) {
      const facility = MOCK_BUSINESS_FACILITIES.find(f => f.id === selectedFacility);
      if (facility) {
        breakdown.facilities = facility.pricePerHour * duration;
      }
    }

    // Add staff cost (placeholder: $50/hour per instructor)
    if (instructors.length > 0 && duration > 0) {
      breakdown.staff = instructors.length * 50 * duration;
    }

    // Add selected resources costs by category
    selectedResources.forEach(resourceId => {
      const resource = allAvailableResources.find(r => r.id === resourceId);
      if (!resource) return;

      const price = resource.price || resource.pricePerHour || 0;
      const category = resource.category || '';

      // Map to budget categories
      if (resource.type === 'Product') {
        if (category === 'Food & Beverage') {
          breakdown.foodBeverage += price;
        } else if (category === 'Safety') {
          breakdown.safety += price;
        } else {
          breakdown.products += price;
        }
      } else if (resource.type === 'Service') {
        if (category === 'Media') {
          breakdown.media += price;
        } else if (category === 'Entertainment') {
          breakdown.entertainment += price;
        } else if (category === 'Safety') {
          breakdown.safety += price;
        } else if (category === 'Food & Beverage') {
          breakdown.foodBeverage += price;
        } else {
          breakdown.services += price;
        }
      }
    });

    return breakdown;
  };

  const budgetBreakdown = calculateBudgetBreakdown();
  const totalBudgetWithFacilities = totalBudget + budgetBreakdown.facilities + budgetBreakdown.staff;

  // Get unique categories from products and services
  const productCategories = Array.from(new Set([
    ...MOCK_BUSINESS_PRODUCTS.map(p => p.category || 'Other'),
    ...MOCK_MARKETPLACE_PRODUCTS.map(p => p.category)
  ])).sort();

  const serviceCategories = Array.from(new Set([
    ...MOCK_BUSINESS_SERVICES.map(s => s.category || 'Other'),
    ...MOCK_MARKETPLACE_SERVICES.map(s => s.category)
  ])).sort();

  // Category icon mapping
  const categoryIcons: Record<string, any> = {
    'Apparel': Shirt,
    'Equipment': Dumbbell,
    'Food & Beverage': Utensils,
    'Safety': ShieldCheck,
    'Awards': Award,
    'Marketing': Megaphone,
    'Technology': Radio,
    'Media': Camera,
    'Entertainment': Music,
    'Wellness': HeartPulse,
    'Other': Package,
  };

  // Carousel settings for horizontal scrolling
  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const renderStepContent = () => {
    const hasTypeSpecificFields = ['workout', 'match', 'training', 'program', 'camp', 'adventure', 'tournament'].includes(selectedActivityType);
    
    // New step flow:
    // Step 1: Basic info + image (always)
    // Step 2: Type-specific (if exists) OR Date/Time & Location
    // Step 3: Date/Time & Location (if type-specific exists) OR Sponsorship
    // Step 4: Sponsorship (only if hasTypeSpecificFields)
    
    let dateTimeLocationStep = hasTypeSpecificFields ? 3 : 2;
    let sponsorshipStep = hasTypeSpecificFields ? 4 : 3;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Activity Type Selection */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Select Activity Type</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {ACTIVITY_TYPES.map((type) => {
                  const IconComponent = getActivityIcon(type.icon);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedActivityType(type.id)}
                      className={`flex-shrink-0 w-32 p-3 border-2 rounded-xl text-center transition-all ${
                        selectedActivityType === type.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <span className="font-semibold text-sm block mb-1">{type.label}</span>
                      <p className="text-xs text-muted-foreground line-clamp-2">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 text-foreground">Basic Information</h3>
              
              {/* Activity Title */}
              <div className="mb-4">
                <Label htmlFor="activity-title">Activity Title</Label>
                <Input id="activity-title" placeholder="e.g., Morning Yoga Session" required />
              </div>

              {/* Sport Selection */}
              <div className="mb-4">
                <Label className="mb-3 block">Sport</Label>
                <div className="grid grid-cols-4 gap-2">
                  {SPORTS.map((sport) => (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => setSelectedSport(sport.id)}
                      className={`p-3 border-2 rounded-xl text-center transition-all ${
                        selectedSport === sport.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{sport.icon}</span>
                      <span className="text-xs font-medium">{sport.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-4">
                <Label className="mb-3 block">Experience Level</Label>
                <div className="grid grid-cols-3 gap-3">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedLevel(level.id)}
                      className={`p-3 border-2 rounded-xl text-center transition-all ${
                        selectedLevel === level.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="font-semibold text-sm block mb-1">{level.label}</span>
                      <span className="text-xs text-muted-foreground">{level.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <Label htmlFor="activity-description">Description</Label>
                <textarea
                  id="activity-description"
                  className="w-full min-h-[100px] px-3 py-2 border border-border rounded-xl bg-input-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Describe your activity..."
                  required
                />
              </div>

              {/* Capacity & Pricing */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="activity-max-participants" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Max Participants
                  </Label>
                  <Input 
                    id="activity-max-participants" 
                    type="number" 
                    placeholder="20" 
                    required
                    value={maxParticipants || ''}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="activity-price" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price per Person ($)
                  </Label>
                  <Input 
                    id="activity-price" 
                    type="number" 
                    placeholder="25" 
                    step="0.01"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave at 0 for free</p>
                </div>
              </div>

              {/* Revenue Calculator */}
              {potentialRevenue > 0 && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-1">Potential Revenue</p>
                      <p className="text-xs text-green-700">
                        {maxParticipants} participants × ${price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">
                        ${potentialRevenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Image */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {uploadedImage ? (
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label 
                    htmlFor="activity-image-file" 
                    className="flex flex-col items-center justify-center p-8 cursor-pointer"
                  >
                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      Drop image here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                    <input
                      id="activity-image-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        // Step 2 is EITHER type-specific (if exists) OR date/time+location
        if (hasTypeSpecificFields) {
          return renderTypeSpecificFields();
        }
        return renderDateTimeAndLocationStep();

      case dateTimeLocationStep:
        // This is step 3 when type-specific fields exist
        return renderDateTimeAndLocationStep();

      case sponsorshipStep:
        return (
          <div className="space-y-6">
            {/* Sponsorship Header & Description */}
            <div>
              <h3 className="font-semibold mb-2">Event Sponsorship</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Turn your event into a sponsored opportunity and attract business partners to support your activity.
              </p>
            </div>

            {/* How It Works Info Box */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-primary">How Event Sponsorship Works</h4>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span><strong>Create Your Event:</strong> Set up your activity and enable sponsorship to make it visible to potential sponsors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span><strong>Define Visibility Tiers:</strong> Offer different sponsorship packages (Gold, Silver, Bronze) with varying levels of brand exposure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span><strong>Attract Sponsors:</strong> Businesses discover your event and choose sponsorship tiers that match their marketing goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span><strong>Showcase Partners:</strong> Sponsor logos appear on event pages, promotional materials, and live displays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span><strong>Manage Everything:</strong> Track sponsorship commitments, coordinate with your team, and deliver on sponsor benefits</span>
                </li>
              </ul>
            </div>

            {/* Enable Sponsorship Toggle */}
            <div className="bg-card border-2 border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <Label htmlFor="enable-sponsorship" className="font-semibold text-base cursor-pointer">
                    Enable Sponsorship for this Event
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow businesses to sponsor this event and gain brand visibility
                  </p>
                </div>
                <Switch
                  id="enable-sponsorship"
                  checked={isSponsoredEvent}
                  onCheckedChange={(checked) => {
                    setIsSponsoredEvent(checked);
                    if (checked) {
                      // Open the new sponsored event modal
                      setIsSponsoredEventModalOpen(true);
                    } else {
                      setSponsorshipSubStep(1);
                    }
                  }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            {/* Sponsorship Configuration (shown when toggled on and expanded) */}
            {isSponsoredEvent && !isSponsorshipExpanded && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Sponsorship Enabled</p>
                      <p className="text-sm text-green-700">Complete the sponsored event details in the modal to the right</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
                {/* Sponsorship Header with Collapse Button */}
                {/* Removed - Sponsorship now handled in modal */}

                {/* Sub-step 1: Mission, Goals & Target Audience */}
                {sponsorshipSubStep === 1 && (
                <div>
                  <h4 className="font-semibold text-primary flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5" />
                    Mission, Goals & Target Audience
                  </h4>
                  
                  {/* Mission & Purpose */}
                  <div className="bg-card rounded-lg p-4 border border-border mb-4">
                    <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      Event Mission & Purpose
                    </h5>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="event-mission">What is the mission of this event?</Label>
                        <textarea
                          id="event-mission"
                          className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md text-sm"
                          placeholder="e.g., Promote youth fitness and healthy competition, build community through sports, raise awareness for mental health through athletics..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">Help sponsors understand the purpose and impact of your event</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="event-cause">Event Cause/Category</Label>
                          <select
                            id="event-cause"
                            className="w-full h-10 px-3 border border-border rounded-md text-sm"
                          >
                            <option value="">Select a category</option>
                            <option value="youth-development">Youth Development</option>
                            <option value="health-wellness">Health & Wellness</option>
                            <option value="community-building">Community Building</option>
                            <option value="charity">Charity/Fundraising</option>
                            <option value="competitive-sports">Competitive Sports</option>
                            <option value="education">Education & Training</option>
                            <option value="social-impact">Social Impact</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="event-impact">Expected Community Impact</Label>
                          <select
                            id="event-impact"
                            className="w-full h-10 px-3 border border-border rounded-md text-sm"
                          >
                            <option value="">Select impact level</option>
                            <option value="local">Local (Neighborhood)</option>
                            <option value="city">City-wide</option>
                            <option value="regional">Regional</option>
                            <option value="national">National</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Target Audience & Reach */}
                  <div className="bg-card rounded-lg p-4 border border-border mb-4">
                    <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Target Audience & Reach
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="target-audience">Primary Target Audience</Label>
                        <Input 
                          id="target-audience" 
                          placeholder="e.g., Fitness enthusiasts 25-40"
                          className="bg-card"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Demographics who will see sponsor brands</p>
                      </div>

                      <div>
                        <Label htmlFor="expected-attendance">Expected Attendance</Label>
                        <Input 
                          id="expected-attendance" 
                          type="number"
                          placeholder="100"
                          className="bg-card"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Participants + spectators</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Label htmlFor="audience-interests">Audience Interests & Characteristics</Label>
                      <textarea
                        id="audience-interests"
                        className="w-full min-h-[60px] px-3 py-2 border border-border rounded-md text-sm"
                        placeholder="e.g., Health-conscious, active lifestyle, social media engaged, interested in sports nutrition and fitness gear..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">Help sponsors understand audience alignment with their brand</p>
                    </div>

                    {/* Audience Value Proposition */}
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Estimated Sponsor Reach</span>
                        <span className="text-2xl font-bold text-primary">100+</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Direct exposure to 100 engaged participants and spectators
                      </p>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <p className="text-xs text-orange-900">
                      <strong>💡 Pro Tip:</strong> A clear mission and well-defined target audience help sponsors understand the value and alignment with their brand. Be specific about who will engage with your event and why it matters.
                    </p>
                  </div>
                </div>
                )}

                {/* Sub-step 2: Event Resources & Budget Setup */}
                {sponsorshipSubStep === 2 && (
                <div>
                  <Separator className="bg-secondary/20" />
                  
                  <h4 className="font-semibold text-primary flex items-center gap-2 mb-4 mt-6">
                    <DollarSign className="w-5 h-5" />
                    Event Resources & Budget Setup
                  </h4>

                  <p className="text-sm text-muted-foreground mb-4">
                    Select products and services for your event budget. Browse horizontal carousels by category. Facilities and staff are configured during activity creation.
                  </p>

                  {/* Category Filter */}
                  <div className="mb-4">
                    <div className="bg-card rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* All Resources Button */}
                        <Button
                          type="button"
                          variant={resourceCategory === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setResourceCategory('all')}
                          className={`h-8 ${resourceCategory === 'all' ? 'bg-primary' : ''}`}
                        >
                          All
                        </Button>
                        
                        <Separator orientation="vertical" className="h-6" />

                        {/* Combined Categories */}
                        {[...productCategories, ...serviceCategories].filter((v, i, a) => a.indexOf(v) === i).map((category) => {
                          const IconComponent = categoryIcons[category] || Package;
                          return (
                            <Button
                              key={category}
                              type="button"
                              variant={resourceCategory === category ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setResourceCategory(category)}
                              className={`h-8 ${resourceCategory === category ? 'bg-primary' : ''}`}
                            >
                              <IconComponent className="w-3.5 h-3.5 mr-1.5" />
                              {category}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Marketplace Search */}
                  {resourceCategory !== 'all' && (
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search marketplace products and services..."
                        value={marketplaceSearchQuery}
                        onChange={(e) => setMarketplaceSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  )}

                  {/* Horizontal Carousels for Products and Services */}
                  <div className="space-y-6 mb-6">
                    {/* My Products */}
                    <ResourceCarousel
                      title="My Products"
                      icon={<Package className="w-4 h-4 text-primary" />}
                      resources={MOCK_BUSINESS_PRODUCTS.filter(item => 
                        resourceCategory === 'all' || item.category === resourceCategory
                      )}
                      selectedResources={selectedResources}
                      onToggle={toggleResource}
                      colorScheme="blue"
                    />

                    {/* My Services */}
                    <ResourceCarousel
                      title="My Services"
                      icon={<Users className="w-4 h-4 text-primary" />}
                      resources={MOCK_BUSINESS_SERVICES.filter(item => 
                        resourceCategory === 'all' || item.category === resourceCategory
                      )}
                      selectedResources={selectedResources}
                      onToggle={toggleResource}
                      colorScheme="blue"
                    />

                    {/* Marketplace Products */}
                    <ResourceCarousel
                      title="Marketplace - Products"
                      icon={<ShoppingCart className="w-4 h-4 text-secondary" />}
                      resources={MOCK_MARKETPLACE_PRODUCTS.filter(product => 
                        (resourceCategory === 'all' || product.category === resourceCategory) &&
                        (!marketplaceSearchQuery || 
                          product.name.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()) ||
                          product.businessName.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()))
                      )}
                      selectedResources={selectedResources}
                      onToggle={toggleResource}
                      colorScheme="orange"
                    />

                    {/* Marketplace Services */}
                    <ResourceCarousel
                      title="Marketplace - Services"
                      icon={<Users className="w-4 h-4 text-purple-600" />}
                      resources={MOCK_MARKETPLACE_SERVICES.filter(service => 
                        (resourceCategory === 'all' || service.category === resourceCategory) &&
                        (!marketplaceSearchQuery || 
                          service.name.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()) ||
                          service.businessName.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()) ||
                          service.category.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()))
                      )}
                      selectedResources={selectedResources}
                      onToggle={toggleResource}
                      colorScheme="purple"
                    />
                  </div>

                  {/* Event Budget Breakdown Table */}
                  <div className="bg-card rounded-lg border-2 border-border p-4 mb-4">
                    <h5 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Event Budget Breakdown
                    </h5>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-border">
                            <th className="text-left py-2 px-3 font-semibold text-foreground">Category</th>
                            <th className="text-right py-2 px-3 font-semibold text-foreground">Allocated</th>
                            <th className="text-right py-2 px-3 font-semibold text-foreground">% of Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <span>Facilities</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.facilities.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.facilities / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>Staff (Refs/Instructors)</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.staff.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.staff / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span>Products</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.products.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.products / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-muted-foreground" />
                                <span>Services</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.services.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.services / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <Camera className="w-4 h-4 text-muted-foreground" />
                                <span>Media</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.media.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.media / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                                <span>Safety</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.safety.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.safety / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <Music className="w-4 h-4 text-muted-foreground" />
                                <span>Entertainment</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.entertainment.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.entertainment / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-muted-foreground" />
                                <span>Food & Beverage</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              ${budgetBreakdown.foodBeverage.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-3 text-muted-foreground">
                              {totalBudgetWithFacilities > 0 ? Math.round((budgetBreakdown.foodBeverage / totalBudgetWithFacilities) * 100) : 0}%
                            </td>
                          </tr>
                          <tr className="bg-muted font-semibold">
                            <td className="py-3 px-3 text-primary">Total Event Budget</td>
                            <td className="text-right py-3 px-3 text-primary">${totalBudgetWithFacilities.toLocaleString()}</td>
                            <td className="text-right py-3 px-3 text-primary">100%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {totalBudgetWithFacilities > 0 && (
                      <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-blue-900">
                          <strong>💡 Budget includes:</strong> {selectedFacility ? '✓ Facility' : ''} {instructors.length > 0 ? `✓ ${instructors.length} Staff` : ''} {selectedResources.length > 0 ? `✓ ${selectedResources.length} Products/Services` : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Budget Summary */}
                  <div className="bg-card rounded-lg border-2 border-primary p-4 space-y-4 mt-4">
                    <h5 className="font-semibold text-primary flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Event Budget Summary
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Total Event Budget</Label>
                        <div className="mt-1 text-2xl font-bold text-primary">
                          ${totalBudgetWithFacilities.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedFacility && 'Facility + '}
                          {instructors.length > 0 && `${instructors.length} Staff + `}
                          {selectedResources.length} Resource{selectedResources.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="sponsorship-goal-input" className="text-sm font-medium text-foreground">
                          Sponsorship Goal ($)
                        </Label>
                        <Input
                          id="sponsorship-goal-input"
                          type="number"
                          value={sponsorshipGoal || ''}
                          onChange={(e) => setSponsorshipGoal(Number(e.target.value))}
                          placeholder="Enter target"
                          className="mt-1 text-lg font-semibold"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          How much to raise?
                        </p>
                      </div>
                    </div>

                    {sponsorshipGoal > 0 && totalBudgetWithFacilities > 0 && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Budget Coverage</span>
                          <span className="text-sm font-bold text-green-600">
                            {Math.round((sponsorshipGoal / totalBudgetWithFacilities) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all" 
                            style={{ width: `${Math.min(100, (sponsorshipGoal / totalBudgetWithFacilities) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {sponsorshipGoal >= totalBudgetWithFacilities 
                            ? `Goal covers full budget of $${totalBudgetWithFacilities.toLocaleString()}`
                            : `Goal covers $${sponsorshipGoal.toLocaleString()} of $${totalBudgetWithFacilities.toLocaleString()}`
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Empty State */}
                  {selectedResources.length === 0 && (
                    <div className="bg-muted rounded-lg border-2 border-dashed border-border p-6 text-center mt-4">
                      <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground mb-1">No resources selected yet</p>
                      <p className="text-xs text-muted-foreground">
                        Select products or services from the carousels above to build your event budget
                      </p>
                    </div>
                  )}
                </div>
                )}

                {/* Sub-step 3: Communication & Marketing Plan */}
                {sponsorshipSubStep === 3 && (
                <div>
                <Separator className="bg-secondary/20" />

                {/* Communication Plan */}
                <div>
                  <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                    <ImageIcon className="w-5 h-5" />
                    Communication & Marketing Plan
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define your event's marketing strategy and visibility anchors
                  </p>

                  {/* Marketing Materials */}
                  <div className="bg-card rounded-lg p-4 border border-border mb-4">
                    <h5 className="font-semibold text-foreground mb-3">Event Poster & Marketing Materials</h5>
                    
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted hover:bg-accent transition-colors cursor-pointer">
                      <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Upload Event Poster</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Browse Files
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="border border-border rounded-lg p-3 text-center bg-muted hover:bg-accent transition-colors cursor-pointer">
                        <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                        <p className="text-xs font-medium text-foreground">Additional Images</p>
                        <p className="text-xs text-muted-foreground">Gallery photos</p>
                      </div>
                      <div className="border border-border rounded-lg p-3 text-center bg-muted hover:bg-accent transition-colors cursor-pointer">
                        <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                        <p className="text-xs font-medium text-foreground">Social Assets</p>
                        <p className="text-xs text-muted-foreground">Stories, posts</p>
                      </div>
                    </div>
                  </div>

                  {/* Communication Timeline */}
                  <div className="bg-card rounded-lg p-5 border border-border">
                    <div className="mb-4">
                      <h5 className="font-semibold text-foreground text-lg">Communication Timeline</h5>
                      <p className="text-sm text-muted-foreground mt-1">Plan your communication strategy, channels, frequency, and budget across all event phases</p>
                    </div>
                    
                    {/* Phase Tabs */}
                    <div className="flex gap-2 mb-4 p-1 bg-accent rounded-lg">
                      <button
                        type="button"
                        onClick={() => setActiveCommPhase('pre')}
                        className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                          activeCommPhase === 'pre'
                            ? 'bg-card text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Pre-Event</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Before event day</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveCommPhase('during')}
                        className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                          activeCommPhase === 'during'
                            ? 'bg-card text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Activity className="w-4 h-4" />
                          <span>During Event</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Live coverage</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveCommPhase('post')}
                        className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                          activeCommPhase === 'post'
                            ? 'bg-card text-primary shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Trophy className="w-4 h-4" />
                          <span>Post-Event</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">After event day</p>
                      </button>
                    </div>

                    {/* Phase Content */}
                    <CommunicationPhaseContent
                      phase={activeCommPhase}
                      printMedia={
                        activeCommPhase === 'pre' ? preEventPrintMedia :
                        activeCommPhase === 'during' ? duringEventPrintMedia :
                        postEventPrintMedia
                      }
                      onPrintMediaChange={(value) => {
                        if (activeCommPhase === 'pre') setPreEventPrintMedia(value);
                        else if (activeCommPhase === 'during') setDuringEventPrintMedia(value);
                        else setPostEventPrintMedia(value);
                      }}
                      athleteCollab={
                        activeCommPhase === 'pre' ? preEventAthleteCollab :
                        activeCommPhase === 'during' ? duringEventAthleteCollab :
                        postEventAthleteCollab
                      }
                      onAthleteCollabChange={(value) => {
                        if (activeCommPhase === 'pre') setPreEventAthleteCollab(value);
                        else if (activeCommPhase === 'during') setDuringEventAthleteCollab(value);
                        else setPostEventAthleteCollab(value);
                      }}
                      selectedAthlete={selectedAthletes[activeCommPhase]}
                      onSelectAthlete={(athlete) => setSelectedAthletes(prev => ({ ...prev, [activeCommPhase]: athlete }))}
                      athleteSearchQuery={athleteSearchQuery}
                      onAthleteSearchChange={setAthleteSearchQuery}
                      selectedDeliverables={athleteDeliverables[activeCommPhase]}
                      onDeliverablesChange={(deliverables) => setAthleteDeliverables(prev => ({ ...prev, [activeCommPhase]: deliverables }))}
                    />
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 mt-4">
                    <p className="text-xs text-orange-900">
                      <strong>💡 Pro Tip:</strong> A strong communication plan amplifies sponsor visibility and increases event reach. Athlete/Influencer collaborations are now integrated into each timeline phase for targeted engagement strategies.
                    </p>
                  </div>
                </div>
                </div>
                )}

                {/* Sub-step 4: Sponsorship Visibility Tiers */}
                {sponsorshipSubStep === 4 && (
                <div>
                  <Separator className="bg-secondary/20" />

                  {/* Visibility Tiers Configuration */}
                  <div>
                    <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5" />
                    Sponsorship Visibility Tiers
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define sponsorship packages with different visibility levels and pricing
                  </p>

                  <div className="space-y-4">
                    {/* Gold Tier */}
                    <div className="bg-card rounded-lg p-4 border-2 border-yellow-300">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <h5 className="font-semibold text-yellow-700">Gold Tier - Premium Visibility</h5>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="gold-price" className="text-xs">Price ($)</Label>
                          <Input 
                            id="gold-price" 
                            type="number" 
                            placeholder="2500"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gold-slots" className="text-xs">Available Slots</Label>
                          <Input 
                            id="gold-slots" 
                            type="number" 
                            placeholder="2"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gold-visibility" className="text-xs">Visibility %</Label>
                          <Input 
                            id="gold-visibility" 
                            type="number" 
                            placeholder="100"
                            className="h-9 text-sm"
                            disabled
                            value="100"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label htmlFor="gold-benefits" className="text-xs">Sponsor Visibility Assets</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          {/* Jersey 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 hover:border-yellow-400 transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2 relative">
                                  {/* Jersey Icon/Preview */}
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-yellow-600">
                                    <path d="M16 4l3 3v13H5V7l3-3h8z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
                                    <circle cx="8" cy="5" r="1.5" fill="currentColor"/>
                                    <circle cx="16" cy="5" r="1.5" fill="currentColor"/>
                                  </svg>
                                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <p className="text-xs font-medium text-center text-yellow-900">Jersey</p>
                                <p className="text-xs text-yellow-700 mt-1">Selected</p>
                              </div>
                            </div>
                          </div>

                          {/* Poster 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-muted rounded-lg border-2 border-border hover:border-yellow-300 transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2">
                                  {/* Poster Icon */}
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                                    <rect x="6" y="3" width="12" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
                                    <path d="M9 7h6M9 10h6M9 13h4" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-center text-muted-foreground">Poster</p>
                                <p className="text-xs text-muted-foreground mt-1">Click to select</p>
                              </div>
                            </div>
                          </div>

                          {/* Banner 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-muted rounded-lg border-2 border-border hover:border-yellow-300 transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2">
                                  {/* Banner Icon */}
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                                    <rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
                                    <path d="M7 11h10" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-center text-muted-foreground">Banner</p>
                                <p className="text-xs text-muted-foreground mt-1">Click to select</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                          <p className="text-xs text-yellow-900">
                            <strong>Selected:</strong> Jersey - Logo placement on front & back
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Silver Tier */}
                    <div className="bg-card rounded-lg p-4 border-2 border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-muted-foreground" />
                        <h5 className="font-semibold text-muted-foreground">Silver Tier - Enhanced Visibility</h5>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="silver-price" className="text-xs">Price ($)</Label>
                          <Input 
                            id="silver-price" 
                            type="number" 
                            placeholder="1500"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="silver-slots" className="text-xs">Available Slots</Label>
                          <Input 
                            id="silver-slots" 
                            type="number" 
                            placeholder="4"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="silver-visibility" className="text-xs">Visibility %</Label>
                          <Input 
                            id="silver-visibility" 
                            type="number" 
                            placeholder="60"
                            className="h-9 text-sm"
                            disabled
                            value="60"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label htmlFor="silver-benefits" className="text-xs">Sponsor Visibility Assets</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          {/* Jersey 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-muted rounded-lg border-2 border-border hover:border-border transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2 relative">
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                                    <path d="M16 4l3 3v13H5V7l3-3h8z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
                                    <circle cx="8" cy="5" r="1.5" fill="currentColor"/>
                                    <circle cx="16" cy="5" r="1.5" fill="currentColor"/>
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-center text-muted-foreground">Jersey</p>
                                <p className="text-xs text-muted-foreground mt-1">Click to select</p>
                              </div>
                            </div>
                          </div>

                          {/* Poster 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-border hover:border-primary/30 transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2 relative">
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                                    <rect x="6" y="3" width="12" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
                                    <path d="M9 7h6M9 10h6M9 13h4" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <p className="text-xs font-medium text-center text-foreground">Poster</p>
                                <p className="text-xs text-muted-foreground mt-1">Selected</p>
                              </div>
                            </div>
                          </div>

                          {/* Banner 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-muted rounded-lg border-2 border-border hover:border-border transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2">
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                                    <rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
                                    <path d="M7 11h10" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-center text-muted-foreground">Banner</p>
                                <p className="text-xs text-muted-foreground mt-1">Click to select</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-muted rounded border border-border">
                          <p className="text-xs text-foreground">
                            <strong>Selected:</strong> Poster - Logo on event posters
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bronze Tier */}
                    <div className="bg-card rounded-lg p-4 border-2 border-orange-300">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-orange-600" />
                        <h5 className="font-semibold text-orange-700">Bronze Tier - Standard Visibility</h5>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="bronze-price" className="text-xs">Price ($)</Label>
                          <Input 
                            id="bronze-price" 
                            type="number" 
                            placeholder="500"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bronze-slots" className="text-xs">Available Slots</Label>
                          <Input 
                            id="bronze-slots" 
                            type="number" 
                            placeholder="8"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bronze-visibility" className="text-xs">Visibility %</Label>
                          <Input 
                            id="bronze-visibility" 
                            type="number" 
                            placeholder="30"
                            className="h-9 text-sm"
                            disabled
                            value="30"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Label htmlFor="bronze-benefits" className="text-xs">Sponsor Visibility Assets</Label>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          {/* Jersey 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-muted rounded-lg border-2 border-border hover:border-orange-300 transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2 relative">
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                                    <path d="M16 4l3 3v13H5V7l3-3h8z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
                                    <circle cx="8" cy="5" r="1.5" fill="currentColor"/>
                                    <circle cx="16" cy="5" r="1.5" fill="currentColor"/>
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-center text-muted-foreground">Jersey</p>
                                <p className="text-xs text-muted-foreground mt-1">Click to select</p>
                              </div>
                            </div>
                          </div>

                          {/* Poster 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-muted rounded-lg border-2 border-border hover:border-orange-300 transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2">
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-muted-foreground">
                                    <rect x="6" y="3" width="12" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
                                    <path d="M9 7h6M9 10h6M9 13h4" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-center text-muted-foreground">Poster</p>
                                <p className="text-xs text-muted-foreground mt-1">Click to select</p>
                              </div>
                            </div>
                          </div>

                          {/* Banner 3D Model */}
                          <div className="relative group cursor-pointer">
                            <div className="aspect-square bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300 hover:border-orange-400 transition-all overflow-hidden">
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                                <div className="w-16 h-16 mb-2 relative">
                                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-orange-600">
                                    <rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
                                    <path d="M7 11h10" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <p className="text-xs font-medium text-center text-orange-700">Banner</p>
                                <p className="text-xs text-orange-600 mt-1">Selected</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                          <p className="text-xs text-orange-900">
                            <strong>Selected:</strong> Banner - Logo on event banners
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 mt-4">
                    <p className="text-xs text-blue-900">
                      <strong>💡 Tip:</strong> Higher tiers should offer more exposure and benefits. Visibility % indicates how prominently sponsors appear on event materials. You can customize benefits to match your event's offerings.
                    </p>
                  </div>
                  </div>
                </div>
                )}

                {/* Sub-step Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-secondary/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSponsorshipSubStep(Math.max(1, sponsorshipSubStep - 1))}
                    disabled={sponsorshipSubStep === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-all ${
                          step === sponsorshipSubStep
                            ? 'bg-secondary w-4'
                            : step < sponsorshipSubStep
                            ? 'bg-green-500'
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={() => setSponsorshipSubStep(Math.min(4, sponsorshipSubStep + 1))}
                    disabled={sponsorshipSubStep === 4}
                    className="gap-2 bg-secondary hover:bg-[#E67A2F]"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderTypeSpecificFields = () => {
    switch (selectedActivityType) {
      case 'workout':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Dumbbell className="w-5 h-5" />
              Workout Details
            </h3>
            <div>
              <Label htmlFor="focus-area">Focus Area</Label>
              <div className="mt-2 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-3">Click on body areas to select workout focus</p>
                
                <div className="flex gap-6 items-start justify-center">
                  {/* Front View */}
                  <div className="flex-1 max-w-[200px]">
                    <p className="text-xs font-medium text-center mb-2 text-foreground">Front View</p>
                    <svg viewBox="0 0 200 400" className="w-full h-auto">
                      {/* Head */}
                      <ellipse cx="100" cy="40" rx="25" ry="30" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Neck */}
                      <rect x="90" y="65" width="20" height="15" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Shoulders */}
                      <ellipse cx="65" cy="90" rx="20" ry="15" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" className="cursor-pointer hover:fill-blue-300 transition-colors" />
                      <ellipse cx="135" cy="90" rx="20" ry="15" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" className="cursor-pointer hover:fill-blue-300 transition-colors" />
                      
                      {/* Chest/Upper Body */}
                      <rect x="70" y="95" width="60" height="50" rx="10" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" className="cursor-pointer hover:fill-blue-300 transition-colors" />
                      
                      {/* Arms */}
                      <rect x="45" y="95" width="18" height="70" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="137" y="95" width="18" height="70" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Forearms */}
                      <rect x="42" y="165" width="18" height="60" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="140" y="165" width="18" height="60" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Core/Abs */}
                      <rect x="75" y="150" width="50" height="60" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" className="cursor-pointer hover:fill-blue-300 transition-colors" />
                      
                      {/* Hips */}
                      <ellipse cx="100" cy="220" rx="35" ry="20" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Quads */}
                      <rect x="70" y="235" width="25" height="80" rx="12" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="105" y="235" width="25" height="80" rx="12" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Calves */}
                      <rect x="73" y="320" width="20" height="60" rx="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="107" y="320" width="20" height="60" rx="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                    </svg>
                  </div>
                  
                  {/* Back View */}
                  <div className="flex-1 max-w-[200px]">
                    <p className="text-xs font-medium text-center mb-2 text-foreground">Back View</p>
                    <svg viewBox="0 0 200 400" className="w-full h-auto">
                      {/* Head */}
                      <ellipse cx="100" cy="40" rx="25" ry="30" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Neck */}
                      <rect x="90" y="65" width="20" height="15" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Shoulders */}
                      <ellipse cx="65" cy="90" rx="20" ry="15" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <ellipse cx="135" cy="90" rx="20" ry="15" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Upper Back */}
                      <rect x="70" y="95" width="60" height="50" rx="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Arms */}
                      <rect x="45" y="95" width="18" height="70" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="137" y="95" width="18" height="70" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Forearms */}
                      <rect x="42" y="165" width="18" height="60" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="140" y="165" width="18" height="60" rx="9" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Lower Back */}
                      <rect x="75" y="150" width="50" height="60" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Glutes */}
                      <ellipse cx="100" cy="220" rx="35" ry="20" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Hamstrings */}
                      <rect x="70" y="235" width="25" height="80" rx="12" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="105" y="235" width="25" height="80" rx="12" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      
                      {/* Calves */}
                      <rect x="73" y="320" width="20" height="60" rx="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                      <rect x="107" y="320" width="20" height="60" rx="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" className="cursor-pointer hover:fill-blue-200 transition-colors" />
                    </svg>
                  </div>
                </div>
                
                {/* Selected Areas Display */}
                <div className="mt-4 p-3 bg-card rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">Selected Focus Areas:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Chest
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Shoulders
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Core
                    </span>
                    <button className="px-2 py-1 border border-dashed border-border text-muted-foreground rounded-full text-xs hover:border-blue-400 hover:text-blue-600 transition-colors">
                      + Add more
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="intensity">Intensity Level</Label>
              <select id="intensity" className="w-full px-3 py-2 border border-border rounded-md">
                <option value="">Select intensity</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            <div>
              <Label htmlFor="equipment">Equipment Needed</Label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Dumbbells */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-400 hover:border-blue-500 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Dumbbell className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium text-center text-blue-900">Dumbbells</p>
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yoga Mat */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-card rounded-lg border-2 border-border hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-muted-foreground">
                          <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                          <path d="M4 8h16M4 10h16M4 16h16" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground">Yoga Mat</p>
                    </div>
                  </div>
                </div>

                {/* Resistance Bands */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-400 hover:border-purple-500 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-purple-600">
                          <path d="M4 12c0-4 2-6 4-6s4 2 4 6-2 6-4 6-4-2-4-6z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
                          <path d="M12 12c0-4 2-6 4-6s4 2 4 6-2 6-4 6-4-2-4-6z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-purple-900">Resistance Bands</p>
                      <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kettlebell */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-card rounded-lg border-2 border-border hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-muted-foreground">
                          <rect x="9" y="4" width="6" height="3" rx="1" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground">Kettlebell</p>
                    </div>
                  </div>
                </div>

                {/* Pull-up Bar */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-card rounded-lg border-2 border-border hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-muted-foreground">
                          <path d="M4 8h16M8 8v8M16 8v8" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                          <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground">Pull-up Bar</p>
                    </div>
                  </div>
                </div>

                {/* Jump Rope */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-card rounded-lg border-2 border-border hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-muted-foreground">
                          <path d="M6 8c0 4 2 8 6 10 4-2 6-6 6-10" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <circle cx="6" cy="8" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                          <circle cx="18" cy="8" r="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground">Jump Rope</p>
                    </div>
                  </div>
                </div>

                {/* Bench */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-card rounded-lg border-2 border-border hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-muted-foreground">
                          <rect x="4" y="10" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                          <path d="M6 14v4M18 14v4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground">Bench</p>
                    </div>
                  </div>
                </div>

                {/* Medicine Ball */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-card rounded-lg border-2 border-border hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-muted-foreground">
                          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground">Medicine Ball</p>
                    </div>
                  </div>
                </div>

                {/* Foam Roller */}
                <div className="relative group cursor-pointer">
                  <div className="p-4 bg-card rounded-lg border-2 border-border hover:border-blue-400 transition-all">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-muted-foreground">
                          <rect x="6" y="9" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                          <path d="M8 12h1M11 12h1M14 12h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-center text-muted-foreground">Foam Roller</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-blue-900">
                  <strong>Selected:</strong> Dumbbells, Resistance Bands
                </p>
              </div>
            </div>
          </div>
        );

      case 'match':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Match Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="home-team">Home Team</Label>
                <Input id="home-team" placeholder="Team name" />
              </div>
              <div>
                <Label htmlFor="away-team">Away Team</Label>
                <Input id="away-team" placeholder="Team name" />
              </div>
            </div>
            <div>
              <Label htmlFor="competitive-level">Competitive Level</Label>
              <select id="competitive-level" className="w-full px-3 py-2 border border-border rounded-md">
                <option value="">Select level</option>
                <option value="recreational">Recreational</option>
                <option value="competitive">Competitive</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Training Details
            </h3>
            <div>
              <Label htmlFor="instructor-search">Search Instructor/Coach</Label>
              <Input 
                id="instructor-search" 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2"
              />
              
              {/* Selected Instructors */}
              {instructors.length > 0 && (
                <div className="mt-3">
                  <Label className="text-sm text-muted-foreground mb-2">Selected Instructors</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {instructors.map((instructor, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-primary/20"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                            {instructor.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">{instructor}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveInstructor(instructor)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          aria-label="Remove instructor"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Staff Members */}
              <div className="mt-4">
                <Label className="text-sm text-muted-foreground mb-2">
                  {searchQuery ? 'Search Results' : 'Your Staff'}
                </Label>
                <div className="mt-2 max-h-64 overflow-y-auto space-y-2">
                  {filteredStaffMembers.length > 0 ? (
                    filteredStaffMembers.map((staff) => {
                      const isSelected = instructors.includes(staff.name);
                      return (
                        <div
                          key={staff.id}
                          onClick={() => !isSelected && handleSelectStaffMember(staff)}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-accent border-border opacity-50 cursor-not-allowed'
                              : 'bg-card border-border hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{staff.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{staff.email}</p>
                            <p className="text-xs text-secondary font-medium mt-0.5">{staff.role}</p>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No staff members found
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="skill-focus">Skill Focus Areas</Label>
              <Input id="skill-focus" placeholder="e.g., Technique, Speed, Strategy" />
            </div>
          </div>
        );

      case 'program':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Program Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration-weeks">Duration (Weeks)</Label>
                <Input id="duration-weeks" type="number" placeholder="8" />
              </div>
              <div>
                <Label htmlFor="sessions-per-week">Sessions Per Week</Label>
                <Input id="sessions-per-week" type="number" placeholder="3" />
              </div>
            </div>
            <div>
              <Label htmlFor="program-start">Program Start Date</Label>
              <Input id="program-start" type="date" />
            </div>
            <div>
              <Label htmlFor="enrollment-deadline">Enrollment Deadline</Label>
              <Input id="enrollment-deadline" type="date" />
            </div>
          </div>
        );

      case 'camp':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Tent className="w-5 h-5" />
              Camp Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="camp-duration">Duration (Days)</Label>
                <Input id="camp-duration" type="number" placeholder="5" />
              </div>
              <div>
                <Label htmlFor="age-range">Age Range</Label>
                <Input id="age-range" placeholder="e.g., 12-18" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Accommodation Included</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Meals Included</span>
              </label>
            </div>
            <div>
              <Label htmlFor="what-to-bring">What to Bring</Label>
              <textarea
                id="what-to-bring"
                className="w-full min-h-[60px] px-3 py-2 border border-border rounded-md"
                placeholder="List items participants should bring..."
              />
            </div>
          </div>
        );

      case 'adventure':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mountain className="w-5 h-5" />
              Adventure Details
            </h3>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <select id="difficulty" className="w-full px-3 py-2 border border-border rounded-md">
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            <div>
              <Label htmlFor="equipment-provided">Equipment Provided</Label>
              <Input id="equipment-provided" placeholder="e.g., Climbing gear, Safety equipment" />
            </div>
            <div>
              <Label htmlFor="prerequisites">Requirements/Prerequisites</Label>
              <textarea
                id="prerequisites"
                className="w-full min-h-[60px] px-3 py-2 border border-border rounded-md"
                placeholder="Any skills, certifications, or experience required..."
              />
            </div>
          </div>
        );

      case 'tournament':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Tournament Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="num-teams">Number of Teams/Players</Label>
                <Input id="num-teams" type="number" placeholder="16" />
              </div>
              <div>
                <Label htmlFor="tournament-format">Format</Label>
                <select id="tournament-format" className="w-full px-3 py-2 border border-border rounded-md">
                  <option value="">Select format</option>
                  <option value="single-elimination">Single Elimination</option>
                  <option value="double-elimination">Double Elimination</option>
                  <option value="round-robin">Round Robin</option>
                  <option value="swiss">Swiss System</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="registration-deadline">Registration Deadline</Label>
              <Input id="registration-deadline" type="date" />
            </div>
            <div>
              <Label htmlFor="prizes">Prizes</Label>
              <Input id="prizes" placeholder="e.g., $500 1st place, $250 2nd place" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDateTimeAndLocationStep = () => {
    // Get today's date as minimum
    const today = new Date().toISOString().split('T')[0];
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">When is your activity?</h3>
          <div className="grid grid-cols-2 gap-4">
            <DateTimePicker
              label="Date"
              type="date"
              value={selectedDate}
              onChange={setSelectedDate}
              required
              placeholder="Add date"
              minDate={today}
            />
            <DateTimePicker
              label="Time"
              type="time"
              value={selectedTime}
              onChange={setSelectedTime}
              required
              placeholder="Add time"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="activity-duration">Duration (minutes)</Label>
            <Input 
              id="activity-duration" 
              type="number" 
              placeholder="60" 
              value={duration || ''}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Where will it take place?</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setLocationType('facility')}
              className={`p-3 border-2 rounded-lg text-left transition-all ${
                locationType === 'facility'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="font-semibold text-sm">My Facilities</span>
              </div>
              <p className="text-xs text-muted-foreground">Select from your venues</p>
            </button>
            <button
              type="button"
              onClick={() => setLocationType('custom')}
              className={`p-3 border-2 rounded-lg text-left transition-all ${
                locationType === 'custom'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold text-sm">Custom Location</span>
              </div>
              <p className="text-xs text-muted-foreground">Choose from map</p>
            </button>
          </div>

          {locationType === 'facility' && (
            <>
              {selectedDate && selectedTime && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Showing available facilities</span> for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {formatDisplayTime(selectedTime)}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_BUSINESS_FACILITIES.map((facility) => (
                  <button
                    key={facility.id}
                    type="button"
                    onClick={() => setSelectedFacility(facility.id)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all text-left ${
                      selectedFacility === facility.id
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-border'
                    }`}
                  >
                    <img 
                      src={facility.image} 
                      alt={facility.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <p className="font-semibold text-sm">{facility.name}</p>
                      <p className="text-xs text-muted-foreground">{facility.type}</p>
                      <p className="text-xs text-primary mt-1">${facility.pricePerHour}/hour</p>
                    </div>
                    {selectedFacility === facility.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {locationType === 'custom' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="custom-location-name">Location Name</Label>
                <Input 
                  id="custom-location-name" 
                  placeholder="e.g., Central Park"
                  value={customLocation.name}
                  onChange={(e) => setCustomLocation({...customLocation, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="custom-location-address">Address</Label>
                <Input 
                  id="custom-location-address" 
                  placeholder="e.g., New York, NY"
                  value={customLocation.address}
                  onChange={(e) => setCustomLocation({...customLocation, address: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to format time for display
  const formatDisplayTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: getTotalSteps() }).map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className={`h-2 rounded-full flex-1 transition-all ${
                index + 1 < currentStep ? 'bg-primary' : 
                index + 1 === currentStep ? 'bg-secondary' : 'bg-border'
              }`} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-muted-foreground">Step {currentStep} of {getTotalSteps()}</p>
          {isSponsoredEvent && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">Budget:</span>
                <span className="font-semibold text-primary">$5,240</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-secondary" />
                <span className="font-medium text-foreground">Reach:</span>
                <span className="font-semibold text-secondary">150K+</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500" />
                <span className="font-medium text-foreground">Tiers:</span>
                <span className="font-semibold text-foreground">3</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6 mt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={currentStep === 1 ? onCancel : handlePrev}
          className="flex items-center gap-2"
        >
          {currentStep === 1 ? (
            'Cancel'
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </>
          )}
        </Button>
        
        <Button 
          type="button"
          onClick={currentStep === getTotalSteps() ? onSubmit : handleNext}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
        >
          {currentStep === getTotalSteps() ? (
            `Create ${isSponsoredEvent ? 'Event' : 'Activity'}`
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Sponsored Event Modal */}
      <SponsoredEventModal
        open={isSponsoredEventModalOpen}
        onOpenChange={setIsSponsoredEventModalOpen}
        onCancel={() => {
          setIsSponsoredEvent(false);
          setIsSponsoredEventModalOpen(false);
        }}
        onSubmit={() => {
          // The sponsored event data would be handled here
          setIsSponsoredEventModalOpen(false);
        }}
      />
    </div>
  );
}
