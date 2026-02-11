import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import {
  Target, Dumbbell, Trophy, Activity, Calendar, Tent, Mountain, Award,
  MapPin, ChevronLeft, ChevronRight, DollarSign, Users, Star, Sparkles,
  Package, Search, Check, Camera, Music, HeartPulse, Megaphone, Plus,
  Clock, FileText, Building2, UserPlus, X, ExternalLink, Layers, Eye,
  Shirt
} from 'lucide-react';
import {
  ACTIVITY_TYPES, SPORTS, EXPERIENCE_LEVELS, MOCK_BUSINESS_FACILITIES, MOCK_STAFF_MEMBERS,
  MOCK_MARKETPLACE_PRODUCTS, MOCK_MARKETPLACE_SERVICES, MOCK_BUSINESS_PRODUCTS, MOCK_BUSINESS_SERVICES,
  MOCK_ATHLETES_INFLUENCERS
} from '../data/mockData';
import { DateTimePicker } from './DateTimePicker';
import { ResourceCarousel } from './ResourceCarousel';
import { SponsorshipTierBuilder, type SponsorshipTier } from './SponsorshipTierBuilder';

// ── Icon map for activity types ──────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  Target: <Target className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Tent: <Tent className="w-5 h-5" />,
  Mountain: <Mountain className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
};

// ── Step definitions ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Basics', icon: <FileText className="w-4 h-4" /> },
  { id: 2, label: 'Location & Schedule', icon: <MapPin className="w-4 h-4" /> },
  { id: 3, label: 'Resources & Staff', icon: <Package className="w-4 h-4" /> },
  { id: 4, label: 'Sponsorship', icon: <DollarSign className="w-4 h-4" /> },
  { id: 5, label: 'Program & Marketing', icon: <Megaphone className="w-4 h-4" /> },
  { id: 6, label: 'Review', icon: <Eye className="w-4 h-4" /> },
];

// ── Props ────────────────────────────────────────────────────────────
export interface ActivityStepFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

// ── Main component ───────────────────────────────────────────────────
export function ActivityStepForm({ onCancel, onSubmit }: ActivityStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basics
  const [activityType, setActivityType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState('');
  const [level, setLevel] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(20);
  const [price, setPrice] = useState(0);

  // Step 2: Location & Schedule
  const [locationAddress, setLocationAddress] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');

  // Step 3: Resources
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceTab, setResourceTab] = useState<'facilities' | 'products' | 'services' | 'marketplace'>('facilities');

  // Step 4: Sponsorship
  const [isSponsoredEvent, setIsSponsoredEvent] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  const [sponsorshipGoal, setSponsorshipGoal] = useState(0);
  const [eventMission, setEventMission] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [customTiers, setCustomTiers] = useState<SponsorshipTier[]>([]);
  const [eventPoster, setEventPoster] = useState('');

  // Step 5: Program & Marketing
  const [programItems, setProgramItems] = useState<Array<{ time: string; title: string; description: string }>>([
    { time: '09:00', title: '', description: '' },
  ]);
  const [marketingChannels, setMarketingChannels] = useState<string[]>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [athleteSearch, setAthleteSearch] = useState('');

  // External provider quick-add
  const [showExternalAdd, setShowExternalAdd] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [externalType, setExternalType] = useState('');
  const [externalPrice, setExternalPrice] = useState('');

  // ── Helpers ──────────────────────────────────────────────────────
  const toggleResource = (id: string) => {
    setSelectedResources(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleStaff = (id: string) => {
    setSelectedStaff(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const addProgramItem = () => {
    setProgramItems(prev => [...prev, { time: '', title: '', description: '' }]);
  };

  const removeProgramItem = (index: number) => {
    setProgramItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateProgramItem = (index: number, field: string, value: string) => {
    setProgramItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
  };
  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const allResources = [
    ...MOCK_BUSINESS_FACILITIES.map(f => ({ ...f, price: f.pricePerHour })),
    ...MOCK_BUSINESS_PRODUCTS,
    ...MOCK_BUSINESS_SERVICES,
  ];

  const selectedResourcesCost = allResources
    .filter(r => selectedResources.includes(r.id))
    .reduce((sum, r) => sum + r.price, 0);

  // ── Render steps ────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Activity Type */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Activity Type</h3>
        <p className="text-sm text-muted-foreground mb-4">What kind of activity are you creating?</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIVITY_TYPES.map(type => {
            const isSelected = activityType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setActivityType(type.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {ICON_MAP[type.icon] || <Target className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium">{type.label}</span>
                <span className="text-xs text-muted-foreground leading-tight">{type.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Title & Description */}
      <section className="grid gap-5">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">Activity Title <span className="text-destructive">*</span></Label>
          <Input id="title" placeholder="e.g., Summer Basketball Tournament" value={title} onChange={e => setTitle(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="desc" className="text-sm font-medium">Description</Label>
          <textarea
            id="desc"
            rows={3}
            placeholder="Describe the activity, what participants can expect..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </section>

      {/* Sport & Level */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Sport & Level</h3>
        <p className="text-sm text-muted-foreground mb-4">Choose the sport and difficulty level.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Sport</Label>
            <div className="grid grid-cols-3 gap-2">
              {SPORTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSport(s.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    sport === s.id ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Experience Level</Label>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${
                    level === l.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <span className="font-medium">{l.label}</span>
                  <span className="text-muted-foreground">{l.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capacity & Pricing */}
      <section className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="max" className="text-sm font-medium">Max Participants</Label>
          <Input id="max" type="number" min={1} value={maxParticipants} onChange={e => setMaxParticipants(Number(e.target.value))} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="price" className="text-sm font-medium">Price per Participant ($)</Label>
          <Input id="price" type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-1.5" />
        </div>
      </section>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Location */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Location</h3>
        <p className="text-sm text-muted-foreground mb-4">Where will this activity take place?</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address" className="text-sm font-medium">Address</Label>
            <Input id="address" placeholder="Street address" value={locationAddress} onChange={e => setLocationAddress(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="city" className="text-sm font-medium">City</Label>
            <Input id="city" placeholder="City" value={locationCity} onChange={e => setLocationCity(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        {/* Select from business facilities */}
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Or choose from your facilities:</p>
          <div className="flex flex-wrap gap-2">
            {MOCK_BUSINESS_FACILITIES.map(f => (
              <button
                key={f.id}
                onClick={() => setLocationAddress(f.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                  locationAddress === f.name ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span>{f.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Date & Time */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Date & Time</h3>
        <p className="text-sm text-muted-foreground mb-4">When will this activity happen?</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Date</Label>
            <div className="mt-1.5">
              <DateTimePicker type="date" value={date} onChange={setDate} placeholder="Select date" />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Start Time</Label>
            <div className="mt-1.5">
              <DateTimePicker type="time" value={time} onChange={setTime} placeholder="Select time" />
            </div>
          </div>
          <div>
            <Label htmlFor="duration" className="text-sm font-medium">Duration (min)</Label>
            <Input id="duration" type="number" min={15} step={15} value={duration} onChange={e => setDuration(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      </section>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Resources */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-foreground">Resources</h3>
          {selectedResources.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedResources.length} selected &middot; ${selectedResourcesCost}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">Add facilities, products, and services for this activity.</p>

        {/* Resource tabs */}
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 mb-4">
          {([
            { key: 'facilities', label: 'Facilities' },
            { key: 'products', label: 'Products' },
            { key: 'services', label: 'Services' },
            { key: 'marketplace', label: 'Marketplace' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setResourceTab(tab.key)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                resourceTab === tab.key ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={resourceSearch}
            onChange={e => setResourceSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Resource grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(resourceTab === 'facilities'
            ? MOCK_BUSINESS_FACILITIES.map(f => ({ ...f, price: f.pricePerHour, subtitle: `$${f.pricePerHour}/hr` }))
            : resourceTab === 'products'
            ? MOCK_BUSINESS_PRODUCTS.map(p => ({ ...p, subtitle: `$${p.price}` }))
            : resourceTab === 'services'
            ? MOCK_BUSINESS_SERVICES.map(s => ({ ...s, subtitle: `$${s.price}` }))
            : [...MOCK_MARKETPLACE_PRODUCTS.map(p => ({ ...p, subtitle: `$${p.price} - ${p.businessName}` })),
               ...MOCK_MARKETPLACE_SERVICES.map(s => ({ ...s, subtitle: `$${s.price} - ${s.businessName}` }))]
          )
            .filter(r => !resourceSearch || r.name.toLowerCase().includes(resourceSearch.toLowerCase()))
            .map(resource => {
              const isSelected = selectedResources.includes(resource.id);
              return (
                <button
                  key={resource.id}
                  onClick={() => toggleResource(resource.id)}
                  className={`relative flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <img src={resource.image} alt={resource.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{resource.name}</p>
                    <p className="text-xs text-muted-foreground">{resource.subtitle}</p>
                  </div>
                </button>
              );
            })}
        </div>

        {/* Add external provider */}
        <div className="mt-4 pt-4 border-t border-dashed">
          {!showExternalAdd ? (
            <Button variant="outline" size="sm" onClick={() => setShowExternalAdd(true)} className="gap-2">
              <ExternalLink className="w-4 h-4" /> Add External Provider
            </Button>
          ) : (
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Add External Provider</h4>
                <Button variant="ghost" size="sm" onClick={() => setShowExternalAdd(false)} className="h-7 w-7 p-0"><X className="w-4 h-4" /></Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <Input placeholder="Provider name" value={externalName} onChange={e => setExternalName(e.target.value)} />
                <Input placeholder="Type (e.g., Catering)" value={externalType} onChange={e => setExternalType(e.target.value)} />
                <Input placeholder="Price ($)" type="number" value={externalPrice} onChange={e => setExternalPrice(e.target.value)} />
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (externalName) {
                    setShowExternalAdd(false);
                    setExternalName('');
                    setExternalType('');
                    setExternalPrice('');
                  }
                }}
                className="gap-1"
              >
                <Plus className="w-4 h-4" /> Add Provider
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Staff */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Staff & Team</h3>
        <p className="text-sm text-muted-foreground mb-4">Assign staff members to this activity.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {MOCK_STAFF_MEMBERS.map(member => {
            const isSelected = selectedStaff.includes(member.id);
            return (
              <button
                key={member.id}
                onClick={() => toggleStaff(member.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      {/* Sponsorship Toggle */}
      <section className="bg-gradient-to-r from-secondary/5 to-primary/5 border-2 border-secondary/30 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <Label htmlFor="sponsor-toggle" className="font-semibold text-base cursor-pointer">Enable Sponsorship</Label>
              <p className="text-sm text-muted-foreground">Allow businesses to sponsor this event</p>
            </div>
          </div>
          <Switch
            id="sponsor-toggle"
            checked={isSponsoredEvent}
            onCheckedChange={setIsSponsoredEvent}
          />
        </div>
      </section>

      {isSponsoredEvent && (
        <>
          {/* Mission & Budget */}
          <section className="space-y-5">
            <h3 className="text-base font-semibold text-foreground">Event Mission & Budget</h3>
            <div>
              <Label htmlFor="mission" className="text-sm font-medium">Event Mission</Label>
              <textarea
                id="mission"
                rows={2}
                placeholder="What is the purpose and mission of this event?"
                value={eventMission}
                onChange={e => setEventMission(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <Label htmlFor="audience" className="text-sm font-medium">Target Audience</Label>
              <Input id="audience" placeholder="e.g., Fitness enthusiasts, ages 18-35" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className="mt-1.5" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget" className="text-sm font-medium">Total Event Budget ($)</Label>
                <Input id="budget" type="number" min={0} value={totalBudget || ''} onChange={e => setTotalBudget(Number(e.target.value))} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="goal" className="text-sm font-medium">Sponsorship Goal ($)</Label>
                <Input id="goal" type="number" min={0} value={sponsorshipGoal || ''} onChange={e => setSponsorshipGoal(Number(e.target.value))} className="mt-1.5" />
              </div>
            </div>
            {totalBudget > 0 && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Resources cost</span>
                  <span className="font-medium">${selectedResourcesCost}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Remaining budget</span>
                  <span className="font-medium">${totalBudget - selectedResourcesCost}</span>
                </div>
                {sponsorshipGoal > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sponsorship covers</span>
                      <span className="font-medium text-green-600">{Math.min(100, Math.round((sponsorshipGoal / totalBudget) * 100))}% of budget</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Sponsorship Tiers */}
          <section>
            <h3 className="text-base font-semibold text-foreground mb-1">Sponsorship Tiers</h3>
            <p className="text-sm text-muted-foreground mb-4">Create tiered sponsorship packages with logo placement options.</p>
            <SponsorshipTierBuilder
              tiers={customTiers}
              onChange={setCustomTiers}
              eventPoster={eventPoster}
              onPosterUpload={setEventPoster}
            />
          </section>
        </>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8">
      {/* Program / Schedule */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Event Program</h3>
        <p className="text-sm text-muted-foreground mb-4">Build the agenda for your activity.</p>
        <div className="space-y-3">
          {programItems.map((item, i) => (
            <div key={i} className="flex gap-3 items-start bg-muted/30 rounded-xl p-3 border border-border">
              <div className="w-20 flex-shrink-0">
                <Input
                  type="time"
                  value={item.time}
                  onChange={e => updateProgramItem(i, 'time', e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Activity title (e.g., Opening ceremony)"
                  value={item.title}
                  onChange={e => updateProgramItem(i, 'title', e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Brief description..."
                  value={item.description}
                  onChange={e => updateProgramItem(i, 'description', e.target.value)}
                  className="text-sm"
                />
              </div>
              {programItems.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeProgramItem(i)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addProgramItem} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Program Item
          </Button>
        </div>
      </section>

      {/* Marketing Channels */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Marketing & Promotion</h3>
        <p className="text-sm text-muted-foreground mb-4">Choose how you will promote this event.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {['Social Media', 'Email Campaign', 'Flyers & Posters', 'SMS/WhatsApp', 'Website Banner', 'Influencer Collab', 'Press Release', 'Community Posts'].map(channel => {
            const isSelected = marketingChannels.includes(channel);
            return (
              <button
                key={channel}
                onClick={() => setMarketingChannels(prev => isSelected ? prev.filter(c => c !== channel) : [...prev, channel])}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  isSelected ? 'border-primary bg-primary/5 font-medium' : 'border-border hover:border-primary/40'
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                <span>{channel}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Athletes / Influencers */}
      <section>
        <h3 className="text-base font-semibold text-foreground mb-1">Athletes & Influencers</h3>
        <p className="text-sm text-muted-foreground mb-4">Collaborate with athletes or influencers for promotion.</p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search athletes..." value={athleteSearch} onChange={e => setAthleteSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {MOCK_ATHLETES_INFLUENCERS
            .filter(a => !athleteSearch || a.name.toLowerCase().includes(athleteSearch.toLowerCase()))
            .map(athlete => {
              const isSelected = selectedAthletes.includes(athlete.id);
              return (
                <button
                  key={athlete.id}
                  onClick={() => setSelectedAthletes(prev => isSelected ? prev.filter(a => a !== athlete.id) : [...prev, athlete.id])}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <img src={athlete.avatar} alt={athlete.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">{athlete.name}</p>
                      {athlete.verified && <Badge variant="secondary" className="text-[10px] px-1 py-0">Verified</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{athlete.sport} &middot; {(athlete.followers / 1000).toFixed(0)}K followers</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
        </div>
      </section>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-foreground">Review Your Activity</h3>
      <p className="text-sm text-muted-foreground">Double-check everything before creating.</p>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Basics */}
        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="w-4 h-4 text-primary" /> Basics
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div><span className="text-muted-foreground">Title:</span> {title || '-'}</div>
            <div><span className="text-muted-foreground">Type:</span> {ACTIVITY_TYPES.find(t => t.id === activityType)?.label || '-'}</div>
            <div><span className="text-muted-foreground">Sport:</span> {SPORTS.find(s => s.id === sport)?.name || '-'}</div>
            <div><span className="text-muted-foreground">Level:</span> {EXPERIENCE_LEVELS.find(l => l.id === level)?.label || '-'}</div>
            <div><span className="text-muted-foreground">Max participants:</span> {maxParticipants}</div>
            <div><span className="text-muted-foreground">Price:</span> ${price}</div>
          </div>
        </div>

        {/* Location & Schedule */}
        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="w-4 h-4 text-primary" /> Location & Schedule
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div><span className="text-muted-foreground">Address:</span> {locationAddress || '-'}</div>
            <div><span className="text-muted-foreground">City:</span> {locationCity || '-'}</div>
            <div><span className="text-muted-foreground">Date:</span> {date || '-'}</div>
            <div><span className="text-muted-foreground">Time:</span> {time || '-'} ({duration} min)</div>
          </div>
        </div>

        {/* Resources */}
        {selectedResources.length > 0 && (
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package className="w-4 h-4 text-primary" /> Resources ({selectedResources.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allResources.filter(r => selectedResources.includes(r.id)).map(r => (
                <Badge key={r.id} variant="outline" className="text-xs">{r.name}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Total cost: ${selectedResourcesCost}</p>
          </div>
        )}

        {/* Staff */}
        {selectedStaff.length > 0 && (
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="w-4 h-4 text-primary" /> Staff ({selectedStaff.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MOCK_STAFF_MEMBERS.filter(s => selectedStaff.includes(s.id)).map(s => (
                <Badge key={s.id} variant="outline" className="text-xs">{s.name} - {s.role}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Sponsorship */}
        {isSponsoredEvent && (
          <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <DollarSign className="w-4 h-4 text-secondary" /> Sponsorship
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div><span className="text-muted-foreground">Budget:</span> ${totalBudget}</div>
              <div><span className="text-muted-foreground">Sponsorship goal:</span> ${sponsorshipGoal}</div>
              <div><span className="text-muted-foreground">Tiers:</span> {customTiers.length}</div>
            </div>
          </div>
        )}

        {/* Marketing */}
        {marketingChannels.length > 0 && (
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Megaphone className="w-4 h-4 text-primary" /> Marketing
            </div>
            <div className="flex flex-wrap gap-1.5">
              {marketingChannels.map(c => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center ${
                  step.id === currentStep
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : step.id < currentStep
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {step.icon}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-4 h-0.5 flex-shrink-0 ${step.id < currentStep ? 'bg-primary/30' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-6 mt-8 border-t">
        <Button variant="outline" onClick={currentStep === 1 ? onCancel : handlePrev} className="gap-1.5">
          {currentStep === 1 ? 'Cancel' : <><ChevronLeft className="w-4 h-4" /> Previous</>}
        </Button>
        <Button
          onClick={currentStep === STEPS.length ? onSubmit : handleNext}
          className="flex-1 gap-1.5"
        >
          {currentStep === STEPS.length ? (
            <><Sparkles className="w-4 h-4" /> Create {isSponsoredEvent ? 'Sponsored Event' : 'Activity'}</>
          ) : (
            <>Next <ChevronRight className="w-4 h-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
