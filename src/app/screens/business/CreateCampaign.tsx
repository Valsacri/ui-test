import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Slider } from '@/app/components/ui/slider';
import { MOCK_PERSONAL_PROFILE, MOCK_BUSINESS_PROFILES } from '@/app/data/mockData';
import { 
  ArrowLeft, MapPin, Users, Target, DollarSign, TrendingUp, Info, Calendar, 
  Sparkles, Zap, BarChart3, Globe, ChevronRight 
} from 'lucide-react';

interface CreateCampaignProps {
  onBack: () => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
  onSwitchProfile?: (profileType: 'user' | 'business', profileId?: string) => void;
  currentBusinessId?: string;
}

export function CreateCampaign({ 
  onBack, 
  currentBusinessId = 'business-1'
}: CreateCampaignProps) {
  const currentBusiness = MOCK_BUSINESS_PROFILES.find(b => b.id === currentBusinessId) || MOCK_BUSINESS_PROFILES[0];
  
  const [campaignName, setCampaignName] = useState('');
  const [budget, setBudget] = useState(5000);
  const [duration, setDuration] = useState(30);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Geographic targeting
  const [location, setLocation] = useState('New York, NY');
  const [radius, setRadius] = useState(25);
  
  // Demographic targeting
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(45);
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');
  
  // Interest targeting
  const [selectedSports, setSelectedSports] = useState<string[]>(['Running', 'Cycling']);
  const availableSports = ['Running', 'Cycling', 'Basketball', 'Soccer', 'Yoga', 'Swimming', 'Tennis', 'CrossFit'];
  
  const calculateForecasts = () => {
    const basePopulation = radius * radius * 100;
    const ageRange = ageMax - ageMin;
    const ageMultiplier = ageRange / 60;
    const genderMultiplier = gender === 'all' ? 1 : 0.48;
    const interestMultiplier = Math.min(selectedSports.length * 0.15, 0.6);
    const potentialAudience = Math.floor(basePopulation * ageMultiplier * genderMultiplier * interestMultiplier);
    const dailyBudget = budget / duration;
    const costPerEngagement = 2.5 + (selectedSports.length * 0.5);
    const estimatedReach = Math.floor(budget / 0.10);
    const conversionRate = 0.03;
    const estimatedAttendees = Math.floor((budget / costPerEngagement) * conversionRate);
    const estimatedEvents = Math.min(Math.floor(budget / 1000), 10);
    
    return {
      potentialAudience,
      estimatedReach,
      estimatedAttendees,
      estimatedEvents,
      dailyBudget,
      costPerEngagement,
      audienceDensity: potentialAudience > 5000 ? 'high' : potentialAudience > 2000 ? 'medium' : 'low'
    };
  };
  
  const forecasts = calculateForecasts();
  
  const toggleSport = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBack();
  };

  const steps = [
    { id: 1, label: 'Details', icon: Target },
    { id: 2, label: 'Audience', icon: Users },
    { id: 3, label: 'Budget', icon: DollarSign },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border mb-6 overflow-hidden">
        <div className="bg-primary/[0.03] border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h1 className="text-xl font-semibold text-foreground">Create New Campaign</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 ml-7">
                Target your ideal audience and forecast performance
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : isCompleted
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-border mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Campaign Details */}
            {currentStep === 1 && (
              <>
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      Campaign Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name" className="text-sm font-medium">Campaign Name</Label>
                      <Input 
                        id="campaign-name" 
                        placeholder="e.g., Spring Running Series 2026"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="h-11"
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="campaign-start" className="text-sm font-medium">Start Date</Label>
                        <Input id="campaign-start" type="date" className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="campaign-duration" className="text-sm font-medium">Duration (days)</Label>
                        <Input 
                          id="campaign-duration" 
                          type="number" 
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          min="1"
                          max="365"
                          className="h-11"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      Geographic Targeting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                      <Input 
                        id="location" 
                        placeholder="City, State or ZIP code"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-11"
                        required 
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Radius</Label>
                        <span className="text-sm font-semibold text-primary">{radius} miles</span>
                      </div>
                      <Slider
                        value={[radius]}
                        onValueChange={([v]) => setRadius(v)}
                        min={5}
                        max={100}
                        step={5}
                        className="py-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5 mi</span>
                        <span>50 mi</span>
                        <span>100 mi</span>
                      </div>
                    </div>
                    
                    {/* Map Visualization */}
                    <div className="relative h-40 bg-muted rounded-xl border border-border overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Globe className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-foreground">{location}</p>
                          <p className="text-xs text-muted-foreground">{radius} mile radius</p>
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div 
                          className="rounded-full border-2 border-primary/30 bg-primary/5"
                          style={{ 
                            width: `${Math.min(radius * 2, 150)}px`, 
                            height: `${Math.min(radius * 2, 150)}px` 
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(2)}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    Continue to Audience
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 2: Audience Targeting */}
            {currentStep === 2 && (
              <>
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Age Range</Label>
                        <span className="text-sm font-semibold text-primary">{ageMin} - {ageMax} years</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Min Age</Label>
                          <Input 
                            type="number" 
                            value={ageMin}
                            onChange={(e) => setAgeMin(Math.max(13, Math.min(Number(e.target.value), ageMax - 1)))}
                            min="13"
                            max="65"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Max Age</Label>
                          <Input 
                            type="number" 
                            value={ageMax}
                            onChange={(e) => setAgeMax(Math.max(ageMin + 1, Math.min(Number(e.target.value), 65)))}
                            min="13"
                            max="65"
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Gender</Label>
                      <div className="flex gap-2">
                        {(['all', 'male', 'female'] as const).map((g) => (
                          <Button
                            key={g}
                            type="button"
                            variant={gender === g ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setGender(g)}
                            className={`flex-1 capitalize ${gender === g ? 'bg-primary hover:bg-primary/90' : ''}`}
                          >
                            {g}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-secondary" />
                      </div>
                      Sports Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {availableSports.map((sport) => (
                        <button
                          key={sport}
                          type="button"
                          onClick={() => toggleSport(sport)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSports.includes(sport) 
                              ? 'bg-primary text-primary-foreground shadow-sm' 
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {sport}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select sports to target users interested in these activities
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(3)}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    Continue to Budget
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Budget */}
            {currentStep === 3 && (
              <>
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      Budget & Spending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Total Budget</Label>
                        <span className="text-lg font-bold text-primary">${budget.toLocaleString()}</span>
                      </div>
                      <Slider
                        value={[budget]}
                        onValueChange={([v]) => setBudget(v)}
                        min={500}
                        max={50000}
                        step={500}
                        className="py-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$500</span>
                        <span>$25K</span>
                        <span>$50K</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Daily Budget</p>
                        <p className="text-lg font-bold text-foreground">${forecasts.dailyBudget.toFixed(2)}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Cost per Engagement</p>
                        <p className="text-lg font-bold text-foreground">${forecasts.costPerEngagement.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Launch Campaign
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Forecast Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card className="border-primary/20 shadow-sm overflow-hidden">
                <div className="bg-primary px-5 py-4">
                  <div className="flex items-center gap-2 text-primary-foreground">
                    <BarChart3 className="w-5 h-5" />
                    <h3 className="font-semibold text-sm">Performance Forecast</h3>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  {/* Potential Audience */}
                  <div className="p-3.5 bg-muted rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Potential Audience</span>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-semibold ${
                          forecasts.audienceDensity === 'high' 
                            ? 'border-green-300 text-green-700 bg-green-50'
                            : forecasts.audienceDensity === 'medium'
                            ? 'border-amber-300 text-amber-700 bg-amber-50'
                            : 'border-red-300 text-red-700 bg-red-50'
                        }`}
                      >
                        {forecasts.audienceDensity}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {forecasts.potentialAudience.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      People matching your criteria
                    </p>
                  </div>

                  {/* Estimated Reach */}
                  <div className="p-3.5 bg-muted rounded-xl">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Estimated Reach</span>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold text-secondary">
                      {forecasts.estimatedReach.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Total impressions
                    </p>
                  </div>

                  {/* Estimated Attendees */}
                  <div className="p-3.5 bg-muted rounded-xl">
                    <span className="text-xs font-medium text-muted-foreground">Estimated Attendees</span>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {forecasts.estimatedAttendees.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      New event participants
                    </p>
                  </div>

                  {/* Events */}
                  <div className="p-3.5 bg-muted rounded-xl">
                    <span className="text-xs font-medium text-muted-foreground">Events to Sponsor</span>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {forecasts.estimatedEvents}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Recommended events
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs font-semibold text-primary mb-2">
                      Optimization Tips
                    </p>
                    <ul className="text-[11px] text-muted-foreground space-y-1.5">
                      {forecasts.audienceDensity === 'low' && (
                        <li className="flex items-start gap-1.5">
                          <span className="text-secondary mt-0.5">-</span>
                          <span>Expand radius or broaden demographics</span>
                        </li>
                      )}
                      {selectedSports.length === 1 && (
                        <li className="flex items-start gap-1.5">
                          <span className="text-secondary mt-0.5">-</span>
                          <span>Add more sports to increase reach</span>
                        </li>
                      )}
                      {budget < 2000 && (
                        <li className="flex items-start gap-1.5">
                          <span className="text-secondary mt-0.5">-</span>
                          <span>Increase budget for better results</span>
                        </li>
                      )}
                      {forecasts.audienceDensity === 'high' && (
                        <li className="flex items-start gap-1.5">
                          <span className="text-secondary mt-0.5">-</span>
                          <span>Great audience size! Consider A/B testing</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
