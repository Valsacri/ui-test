import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { X, MapPin, Users, Target, DollarSign, TrendingUp, Info, Calendar } from 'lucide-react';

interface AddCampaignModalProps {
  onClose: () => void;
}

export function AddCampaignModal({ onClose }: AddCampaignModalProps) {
  const [campaignName, setCampaignName] = useState('');
  const [budget, setBudget] = useState(5000);
  const [duration, setDuration] = useState(30); // days
  
  // Geographic targeting
  const [location, setLocation] = useState('New York, NY');
  const [radius, setRadius] = useState(25); // miles
  
  // Demographic targeting
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(45);
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all');
  
  // Interest targeting
  const [selectedSports, setSelectedSports] = useState<string[]>(['Running', 'Cycling']);
  const availableSports = ['Running', 'Cycling', 'Basketball', 'Soccer', 'Yoga', 'Swimming', 'Tennis', 'CrossFit'];
  
  // Calculate forecasts based on inputs
  const calculateForecasts = () => {
    // Base population in radius
    const basePopulation = radius * radius * 100; // Simplified calculation
    
    // Apply demographic filters
    const ageRange = ageMax - ageMin;
    const ageMultiplier = ageRange / 60; // Rough demographic filtering
    const genderMultiplier = gender === 'all' ? 1 : 0.48;
    
    // Interest multiplier
    const interestMultiplier = Math.min(selectedSports.length * 0.15, 0.6);
    
    // Calculate potential audience
    const potentialAudience = Math.floor(
      basePopulation * ageMultiplier * genderMultiplier * interestMultiplier
    );
    
    // Calculate daily budget
    const dailyBudget = budget / duration;
    
    // Cost per engagement estimate (varies by competition)
    const costPerEngagement = 2.5 + (selectedSports.length * 0.5);
    
    // Estimated reach (impressions)
    const estimatedReach = Math.floor(budget / 0.10); // $0.10 per impression
    
    // Estimated attendees (conversions)
    const conversionRate = 0.03; // 3% conversion rate
    const estimatedAttendees = Math.floor((budget / costPerEngagement) * conversionRate);
    
    // Estimated events that can be sponsored
    const avgEventCost = budget / 5; // Assume splitting budget across events
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
    console.log('Creating campaign with forecasts:', forecasts);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-5xl my-8">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle>Create New Campaign</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Target your ideal audience and forecast your campaign performance
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Campaign Setup */}
              <div className="lg:col-span-2 space-y-6">
                {/* Campaign Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Campaign Details
                  </h3>
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input 
                      id="campaign-name" 
                      placeholder="e.g., Spring Running Series 2026"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campaign-start">Start Date</Label>
                      <Input id="campaign-start" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="campaign-duration">Duration (days)</Label>
                      <Input 
                        id="campaign-duration" 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>
                </div>

                {/* Geographic Targeting */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Geographic Targeting
                  </h3>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="City, State or ZIP code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a location to target events and audiences nearby
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="radius">
                      Radius: {radius} miles
                    </Label>
                    <input
                      id="radius"
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003C66]"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5 mi</span>
                      <span>50 mi</span>
                      <span>100 mi</span>
                    </div>
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="relative h-48 bg-gray-100 rounded-lg border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-muted-foreground">
                          {location} • {radius} mile radius
                        </p>
                      </div>
                    </div>
                    {/* Simulated map marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div 
                        className="rounded-full bg-[#003C66]/20 border-2 border-[#003C66]"
                        style={{ 
                          width: `${Math.min(radius * 2, 150)}px`, 
                          height: `${Math.min(radius * 2, 150)}px` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Demographic Targeting */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Demographics
                  </h3>
                  <div>
                    <Label>Age Range: {ageMin} - {ageMax} years</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input 
                        type="number" 
                        value={ageMin}
                        onChange={(e) => setAgeMin(Math.max(13, Math.min(Number(e.target.value), ageMax - 1)))}
                        min="13"
                        max="65"
                        className="w-20"
                      />
                      <div className="flex-1 px-2">
                        <input
                          type="range"
                          min="13"
                          max="65"
                          value={ageMin}
                          onChange={(e) => setAgeMin(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003C66]"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">to</span>
                      <div className="flex-1 px-2">
                        <input
                          type="range"
                          min="13"
                          max="65"
                          value={ageMax}
                          onChange={(e) => setAgeMax(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003C66]"
                        />
                      </div>
                      <Input 
                        type="number" 
                        value={ageMax}
                        onChange={(e) => setAgeMax(Math.max(ageMin + 1, Math.min(Number(e.target.value), 65)))}
                        min="13"
                        max="65"
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant={gender === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGender('all')}
                        className={gender === 'all' ? 'bg-[#003C66] hover:bg-[#002A4A]' : ''}
                      >
                        All
                      </Button>
                      <Button
                        type="button"
                        variant={gender === 'male' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGender('male')}
                        className={gender === 'male' ? 'bg-[#003C66] hover:bg-[#002A4A]' : ''}
                      >
                        Male
                      </Button>
                      <Button
                        type="button"
                        variant={gender === 'female' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGender('female')}
                        className={gender === 'female' ? 'bg-[#003C66] hover:bg-[#002A4A]' : ''}
                      >
                        Female
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Interest Targeting */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Sports Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSports.map((sport) => (
                      <Badge
                        key={sport}
                        variant={selectedSports.includes(sport) ? 'default' : 'outline'}
                        className={`cursor-pointer ${
                          selectedSports.includes(sport) 
                            ? 'bg-[#003C66] hover:bg-[#002A4A]' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleSport(sport)}
                      >
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select sports to target users interested in these activities
                  </p>
                </div>

                {/* Budget */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget & Spending
                  </h3>
                  <div>
                    <Label htmlFor="budget">
                      Total Budget: ${budget.toLocaleString()}
                    </Label>
                    <input
                      id="budget"
                      type="range"
                      min="500"
                      max="50000"
                      step="500"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FC8936]"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>$500</span>
                      <span>$25K</span>
                      <span>$50K</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Daily Budget</p>
                      <p className="font-semibold">${forecasts.dailyBudget.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cost per Engagement</p>
                      <p className="font-semibold">${forecasts.costPerEngagement.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Forecast Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-4">
                  <Card className="border-2 border-[#003C66]/20 bg-gradient-to-br from-[#003C66]/5 to-transparent">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Performance Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Potential Audience */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Potential Audience</span>
                          <Badge 
                            variant="outline" 
                            className={
                              forecasts.audienceDensity === 'high' 
                                ? 'border-green-500 text-green-700'
                                : forecasts.audienceDensity === 'medium'
                                ? 'border-yellow-500 text-yellow-700'
                                : 'border-red-500 text-red-700'
                            }
                          >
                            {forecasts.audienceDensity}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-[#003C66]">
                          {forecasts.potentialAudience.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          People matching your criteria
                        </p>
                      </div>

                      {/* Estimated Reach */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-muted-foreground">Estimated Reach</span>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold text-[#FC8936]">
                          {forecasts.estimatedReach.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Total impressions
                        </p>
                      </div>

                      {/* Estimated Attendees */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-muted-foreground">Estimated Attendees</span>
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold text-green-600">
                          {forecasts.estimatedAttendees.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          New event participants
                        </p>
                      </div>

                      {/* Sponsored Events */}
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-muted-foreground">Events to Sponsor</span>
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold text-purple-600">
                          {forecasts.estimatedEvents}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Recommended events
                        </p>
                      </div>

                      {/* Tips */}
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900 mb-1">
                          💡 Optimization Tips
                        </p>
                        <ul className="text-xs text-blue-800 space-y-1">
                          {forecasts.audienceDensity === 'low' && (
                            <li>• Expand radius or broaden demographics</li>
                          )}
                          {selectedSports.length === 1 && (
                            <li>• Add more sports to increase reach</li>
                          )}
                          {budget < 2000 && (
                            <li>• Increase budget for better results</li>
                          )}
                          {forecasts.audienceDensity === 'high' && (
                            <li>• Great audience size! Consider A/B testing</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-[#003C66] hover:bg-[#002A4A]"
                    >
                      Create Campaign
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}