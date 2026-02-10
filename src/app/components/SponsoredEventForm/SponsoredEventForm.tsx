import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Briefcase, 
  Megaphone,
  Plus,
  X,
  FileText,
  TrendingUp,
  Award
} from 'lucide-react';
import { useSponsoredEventForm } from './SponsoredEventFormContext';
import { ResourceSelector } from './ResourceSelector';
import {
  MOCK_BUSINESS_FACILITIES,
  MOCK_BUSINESS_PRODUCTS,
  MOCK_BUSINESS_SERVICES,
  MOCK_MARKETPLACE_PRODUCTS,
  MOCK_MARKETPLACE_SERVICES,
  MOCK_STAFF_MEMBERS,
  MOCK_ATHLETES_INFLUENCERS,
} from '@/app/data/mockData';

export function SponsoredEventForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: () => void }) {
  const { formData, updateFormData, updateSection } = useSponsoredEventForm();
  const [activeTab, setActiveTab] = useState('details');
  const [sponsorTierInput, setSponsorTierInput] = useState({ name: '', price: '', benefits: '' });
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  // Combine all resources
  const allResources = [
    ...MOCK_BUSINESS_FACILITIES,
    ...MOCK_BUSINESS_PRODUCTS,
    ...MOCK_BUSINESS_SERVICES,
    ...MOCK_MARKETPLACE_PRODUCTS,
    ...MOCK_MARKETPLACE_SERVICES,
  ];

  const handleResourceSelect = (id: string) => {
    setSelectedResources(prev => [...prev, id]);
    const resource = allResources.find(r => r.id === id);
    if (resource) {
      updateSection('selectedResources', [
        ...formData.selectedResources,
        {
          id,
          name: resource.name,
          type: resource.type.toLowerCase() as 'facility' | 'product' | 'service',
          price: 'price' in resource ? resource.price : resource.pricePerHour,
        }
      ]);
    }
  };

  const handleResourceDeselect = (id: string) => {
    setSelectedResources(prev => prev.filter(r => r !== id));
    updateSection('selectedResources', formData.selectedResources.filter(r => r.id !== id));
  };

  const handleAddStaff = (staffId: string) => {
    const staff = MOCK_STAFF_MEMBERS.find(s => s.id === staffId);
    if (staff && !selectedStaff.includes(staffId)) {
      setSelectedStaff(prev => [...prev, staffId]);
      updateSection('selectedStaff', [
        ...formData.selectedStaff,
        { id: staffId, name: staff.name, role: staff.role }
      ]);
    }
  };

  const handleRemoveStaff = (staffId: string) => {
    setSelectedStaff(prev => prev.filter(s => s !== staffId));
    updateSection('selectedStaff', formData.selectedStaff.filter(s => s.id !== staffId));
  };

  const handleAddSponsorTier = () => {
    if (sponsorTierInput.name && sponsorTierInput.price) {
      const newTier = {
        id: `tier-${Date.now()}`,
        name: sponsorTierInput.name,
        price: parseFloat(sponsorTierInput.price),
        benefits: sponsorTierInput.benefits.split(',').map(b => b.trim()).filter(Boolean),
        visibility: 'high' as const,
      };
      updateSection('sponsorshipTiers', [...formData.sponsorshipTiers, newTier]);
      setSponsorTierInput({ name: '', price: '', benefits: '' });
    }
  };

  const handleRemoveTier = (tierId: string) => {
    updateSection('sponsorshipTiers', formData.sponsorshipTiers.filter(t => t.id !== tierId));
  };

  const tabs = [
    { id: 'details', label: 'Event Details', icon: FileText },
    { id: 'budget', label: 'Budget & Sponsorship', icon: DollarSign },
    { id: 'resources', label: 'Resources & Partners', icon: Briefcase },
    { id: 'staff', label: 'Staff & Team', icon: Users },
    { id: 'marketing', label: 'Marketing Plan', icon: Megaphone },
    { id: 'program', label: 'Program & Activities', icon: Award },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Sponsored Event</h1>
        <p className="text-muted-foreground mt-1">Build your event project with all necessary details</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
              <tab.icon className="w-4 h-4 mr-1 hidden sm:inline" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Event Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Basic details about your sponsored event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    placeholder="e.g., Summer Sports Festival 2026"
                    value={formData.eventName}
                    onChange={(e) => updateFormData({ eventName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type *</Label>
                  <select
                    id="eventType"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.eventType}
                    onChange={(e) => updateFormData({ eventType: e.target.value })}
                  >
                    <option value="">Select type</option>
                    <option value="tournament">Tournament</option>
                    <option value="festival">Festival</option>
                    <option value="workshop">Workshop</option>
                    <option value="training">Training Camp</option>
                    <option value="marathon">Marathon/Race</option>
                    <option value="championship">Championship</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="eventDescription">Event Description *</Label>
                <Textarea
                  id="eventDescription"
                  placeholder="Describe your event, its goals, and what makes it special..."
                  rows={4}
                  value={formData.eventDescription}
                  onChange={(e) => updateFormData({ eventDescription: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData({ startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData({ endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Central Park, NYC"
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Amateur athletes, Fitness enthusiasts"
                    value={formData.targetAudience}
                    onChange={(e) => updateFormData({ targetAudience: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expectedAttendance">Expected Attendance *</Label>
                <Input
                  id="expectedAttendance"
                  type="number"
                  placeholder="0"
                  value={formData.expectedAttendance}
                  onChange={(e) => updateFormData({ expectedAttendance: parseInt(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => setActiveTab('budget')}>Next: Budget & Sponsorship</Button>
          </div>
        </TabsContent>

        {/* Budget & Sponsorship Tab */}
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Planning</CardTitle>
              <CardDescription>Set your budget and sponsorship goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalBudget">Total Event Budget *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="totalBudget"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.totalBudget}
                      onChange={(e) => updateFormData({ totalBudget: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sponsorshipGoal">Sponsorship Goal *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="sponsorshipGoal"
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      value={formData.sponsorshipGoal}
                      onChange={(e) => updateFormData({ sponsorshipGoal: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Sponsorship Tiers</h3>
                  <Badge variant="outline">{formData.sponsorshipTiers.length} tiers</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  {formData.sponsorshipTiers.map(tier => (
                    <div key={tier.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{tier.name}</h4>
                          <p className="text-sm text-muted-foreground">${tier.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTier(tier.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tier.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{benefit}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-semibold">Add New Tier</h4>
                  <Input
                    placeholder="Tier name (e.g., Gold, Silver)"
                    value={sponsorTierInput.name}
                    onChange={(e) => setSponsorTierInput(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={sponsorTierInput.price}
                    onChange={(e) => setSponsorTierInput(prev => ({ ...prev, price: e.target.value }))}
                  />
                  <Input
                    placeholder="Benefits (comma-separated)"
                    value={sponsorTierInput.benefits}
                    onChange={(e) => setSponsorTierInput(prev => ({ ...prev, benefits: e.target.value }))}
                  />
                  <Button onClick={handleAddSponsorTier} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Tier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setActiveTab('details')}>Back</Button>
            <Button onClick={() => setActiveTab('resources')}>Next: Resources & Partners</Button>
          </div>
        </TabsContent>

        {/* Resources & Partners Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Resources, Partners & Facilities</CardTitle>
              <CardDescription>Choose from available resources or add external providers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceSelector
                resources={allResources}
                selectedIds={selectedResources}
                onSelect={handleResourceSelect}
                onDeselect={handleResourceDeselect}
                onAddExternal={(name, type, details) => {
                  updateSection('selectedResources', [
                    ...formData.selectedResources,
                    {
                      id: `external-${Date.now()}`,
                      name,
                      type,
                      price: details.price,
                      isExternal: true,
                    }
                  ]);
                }}
              />

              {formData.selectedResources.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900">
                    Total Resources Cost: ${formData.selectedResources.reduce((sum, r) => sum + r.price, 0).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setActiveTab('budget')}>Back</Button>
            <Button onClick={() => setActiveTab('staff')}>Next: Staff & Team</Button>
          </div>
        </TabsContent>

        {/* Staff & Team Tab */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assign Staff & Team Members</CardTitle>
              <CardDescription>Add coaches, instructors, and team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-3 block">Available Staff</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {MOCK_STAFF_MEMBERS.map(staff => (
                    <div
                      key={staff.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleAddStaff(staff.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.role}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {staff.specialties.slice(0, 2).map((spec, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddStaff(staff.id);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.selectedStaff.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Selected Staff</h4>
                    {formData.selectedStaff.map(staff => (
                      <div key={staff.id} className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.role}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStaff(staff.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Athletes & Influencers</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MOCK_ATHLETES_INFLUENCERS.slice(0, 4).map(athlete => (
                    <div key={athlete.id} className="p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start gap-3">
                        <img src={athlete.avatar} alt={athlete.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{athlete.name}</p>
                          <p className="text-xs text-muted-foreground">{athlete.handle}</p>
                          <p className="text-xs mt-1">{athlete.followers.toLocaleString()} followers</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setActiveTab('resources')}>Back</Button>
            <Button onClick={() => setActiveTab('marketing')}>Next: Marketing Plan</Button>
          </div>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing & Communication Timeline</CardTitle>
              <CardDescription>Plan your marketing strategy across event phases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {['pre', 'during', 'post'].map((phase) => {
                const phaseData = formData.marketingPhases.find(p => p.phase === phase as any);
                return (
                  <div key={phase} className="p-4 border rounded-lg space-y-3">
                    <h3 className="font-semibold capitalize">{phase} Event Marketing</h3>
                    <div>
                      <Label className="text-xs">Marketing Channels (comma-separated)</Label>
                      <Input
                        placeholder="e.g., Instagram, Facebook, Email, Website"
                        value={phaseData?.channels.join(', ') || ''}
                        onChange={(e) => {
                          const updated = formData.marketingPhases.map(p =>
                            p.phase === phase
                              ? { ...p, channels: e.target.value.split(',').map(c => c.trim()) }
                              : p
                          );
                          updateSection('marketingPhases', updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Messaging & Goals</Label>
                      <Textarea
                        placeholder="What's the key message for this phase?"
                        rows={2}
                        value={phaseData?.messaging || ''}
                        onChange={(e) => {
                          const updated = formData.marketingPhases.map(p =>
                            p.phase === phase ? { ...p, messaging: e.target.value } : p
                          );
                          updateSection('marketingPhases', updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Expected Reach</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={phaseData?.reach || 0}
                        onChange={(e) => {
                          const updated = formData.marketingPhases.map(p =>
                            p.phase === phase ? { ...p, reach: parseInt(e.target.value) || 0 } : p
                          );
                          updateSection('marketingPhases', updated);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setActiveTab('staff')}>Back</Button>
            <Button onClick={() => setActiveTab('program')}>Next: Program & Activities</Button>
          </div>
        </TabsContent>

        {/* Program Tab */}
        <TabsContent value="program" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Program & Activities</CardTitle>
              <CardDescription>Define the schedule and activities for your event</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create a structured program for your event. Add activities, sessions, and schedules.
              </p>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-semibold mb-2">Program Editor</p>
                <p className="text-xs text-muted-foreground">Add event activities and create a detailed schedule</p>
                <Button variant="outline" className="mt-4">Add Activity</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setActiveTab('marketing')}>Back</Button>
            <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
              Create Event
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
