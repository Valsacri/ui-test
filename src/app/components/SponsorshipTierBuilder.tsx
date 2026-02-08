import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export interface SponsorshipTier {
  id: string;
  name: string;
  price: number;
  logoPositions: string[];
  benefits: string[];
}

interface SponsorshipTierBuilderProps {
  tiers: SponsorshipTier[];
  onChange: (tiers: SponsorshipTier[]) => void;
  eventPoster?: string;
  onPosterUpload: (url: string) => void;
}

const LOGO_POSITIONS = [
  { id: 'jersey-front-center', name: 'Jersey Front Center', category: 'jersey' },
  { id: 'jersey-front-left', name: 'Jersey Front Left', category: 'jersey' },
  { id: 'jersey-front-right', name: 'Jersey Front Right', category: 'jersey' },
  { id: 'jersey-back-top', name: 'Jersey Back Top', category: 'jersey' },
  { id: 'jersey-back-bottom', name: 'Jersey Back Bottom', category: 'jersey' },
  { id: 'jersey-left-sleeve', name: 'Left Sleeve', category: 'jersey' },
  { id: 'jersey-right-sleeve', name: 'Right Sleeve', category: 'jersey' },
  { id: 'poster-top', name: 'Poster Top Banner', category: 'poster' },
  { id: 'poster-bottom', name: 'Poster Bottom Banner', category: 'poster' },
  { id: 'poster-side-left', name: 'Poster Left Side', category: 'poster' },
  { id: 'poster-side-right', name: 'Poster Right Side', category: 'poster' },
  { id: 'social-media', name: 'Social Media Posts', category: 'media' },
  { id: 'website', name: 'Website Banner', category: 'media' },
  { id: 'event-venue', name: 'Event Venue Banner', category: 'media' },
];

export function SponsorshipTierBuilder({ 
  tiers, 
  onChange, 
  eventPoster,
  onPosterUpload 
}: SponsorshipTierBuilderProps) {
  const [editingTier, setEditingTier] = useState<SponsorshipTier | null>(null);
  const [selectedJerseyPosition, setSelectedJerseyPosition] = useState<string | null>(null);

  const addNewTier = () => {
    const newTier: SponsorshipTier = {
      id: `tier-${Date.now()}`,
      name: '',
      price: 0,
      logoPositions: [],
      benefits: [],
    };
    setEditingTier(newTier);
  };

  const saveTier = () => {
    if (!editingTier || !editingTier.name || editingTier.price <= 0) {
      toast.error('Please fill in tier name and price');
      return;
    }

    const existingIndex = tiers.findIndex(t => t.id === editingTier.id);
    if (existingIndex >= 0) {
      const updated = [...tiers];
      updated[existingIndex] = editingTier;
      onChange(updated);
    } else {
      onChange([...tiers, editingTier]);
    }
    setEditingTier(null);
    toast.success('Tier saved successfully');
  };

  const deleteTier = (id: string) => {
    onChange(tiers.filter(t => t.id !== id));
    toast.success('Tier deleted');
  };

  const toggleLogoPosition = (positionId: string) => {
    if (!editingTier) return;
    
    const positions = editingTier.logoPositions.includes(positionId)
      ? editingTier.logoPositions.filter(p => p !== positionId)
      : [...editingTier.logoPositions, positionId];
    
    setEditingTier({ ...editingTier, logoPositions: positions });
  };

  const addBenefit = () => {
    if (!editingTier) return;
    setEditingTier({
      ...editingTier,
      benefits: [...editingTier.benefits, '']
    });
  };

  const updateBenefit = (index: number, value: string) => {
    if (!editingTier) return;
    const benefits = [...editingTier.benefits];
    benefits[index] = value;
    setEditingTier({ ...editingTier, benefits });
  };

  const removeBenefit = (index: number) => {
    if (!editingTier) return;
    setEditingTier({
      ...editingTier,
      benefits: editingTier.benefits.filter((_, i) => i !== index)
    });
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to server/storage
      const fakeUrl = URL.createObjectURL(file);
      onPosterUpload(fakeUrl);
      toast.success('Poster uploaded successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Poster Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Event Poster</h3>
              <p className="text-sm text-muted-foreground">
                Upload your event poster to visualize sponsor logo placements
              </p>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {eventPoster ? (
                <div className="space-y-4">
                  <img 
                    src={eventPoster} 
                    alt="Event poster" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPosterUpload('')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Poster
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <label htmlFor="poster-upload" className="cursor-pointer">
                      <span className="text-[#003C66] hover:text-[#FC8936] font-medium">
                        Click to upload
                      </span>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </label>
                    <input
                      id="poster-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePosterUpload}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jersey 3D Visualization */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Jersey Logo Placement</h3>
              <p className="text-sm text-muted-foreground">
                Click on areas to see where sponsor logos will appear
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Front View */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Front View</p>
                <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-8 aspect-[3/4]">
                  {/* Jersey Front SVG */}
                  <svg viewBox="0 0 300 400" className="w-full h-full">
                    {/* Jersey Body */}
                    <path
                      d="M 50 80 L 50 350 L 250 350 L 250 80 L 220 80 L 220 50 L 200 50 L 200 30 L 100 30 L 100 50 L 80 50 L 80 80 Z"
                      fill="#003C66"
                      stroke="#002244"
                      strokeWidth="2"
                    />
                    {/* Collar */}
                    <path
                      d="M 100 30 L 100 50 L 130 60 L 170 60 L 200 50 L 200 30 Z"
                      fill="#002244"
                    />
                    {/* Left Sleeve */}
                    <path
                      d="M 50 80 L 10 120 L 10 180 L 50 160 Z"
                      fill="#003C66"
                      stroke="#002244"
                      strokeWidth="2"
                    />
                    {/* Right Sleeve */}
                    <path
                      d="M 250 80 L 290 120 L 290 180 L 250 160 Z"
                      fill="#003C66"
                      stroke="#002244"
                      strokeWidth="2"
                    />

                    {/* Logo Position Markers */}
                    {/* Front Center */}
                    <rect
                      x="115"
                      y="120"
                      width="70"
                      height="50"
                      fill={selectedJerseyPosition === 'jersey-front-center' ? '#FC8936' : 'rgba(252, 137, 54, 0.3)'}
                      stroke="#FC8936"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer hover:fill-[#FC8936] transition-all"
                      onClick={() => setSelectedJerseyPosition('jersey-front-center')}
                    />
                    <text x="150" y="150" textAnchor="middle" fill="white" fontSize="10" className="pointer-events-none">
                      CENTER
                    </text>

                    {/* Front Left */}
                    <rect
                      x="60"
                      y="140"
                      width="45"
                      height="35"
                      fill={selectedJerseyPosition === 'jersey-front-left' ? '#FC8936' : 'rgba(252, 137, 54, 0.3)'}
                      stroke="#FC8936"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer hover:fill-[#FC8936] transition-all"
                      onClick={() => setSelectedJerseyPosition('jersey-front-left')}
                    />
                    <text x="82" y="162" textAnchor="middle" fill="white" fontSize="8" className="pointer-events-none">
                      LEFT
                    </text>

                    {/* Front Right */}
                    <rect
                      x="195"
                      y="140"
                      width="45"
                      height="35"
                      fill={selectedJerseyPosition === 'jersey-front-right' ? '#FC8936' : 'rgba(252, 137, 54, 0.3)'}
                      stroke="#FC8936"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer hover:fill-[#FC8936] transition-all"
                      onClick={() => setSelectedJerseyPosition('jersey-front-right')}
                    />
                    <text x="217" y="162" textAnchor="middle" fill="white" fontSize="8" className="pointer-events-none">
                      RIGHT
                    </text>

                    {/* Left Sleeve */}
                    <rect
                      x="15"
                      y="130"
                      width="30"
                      height="25"
                      fill={selectedJerseyPosition === 'jersey-left-sleeve' ? '#FC8936' : 'rgba(252, 137, 54, 0.3)'}
                      stroke="#FC8936"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer hover:fill-[#FC8936] transition-all"
                      onClick={() => setSelectedJerseyPosition('jersey-left-sleeve')}
                    />

                    {/* Right Sleeve */}
                    <rect
                      x="255"
                      y="130"
                      width="30"
                      height="25"
                      fill={selectedJerseyPosition === 'jersey-right-sleeve' ? '#FC8936' : 'rgba(252, 137, 54, 0.3)'}
                      stroke="#FC8936"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer hover:fill-[#FC8936] transition-all"
                      onClick={() => setSelectedJerseyPosition('jersey-right-sleeve')}
                    />
                  </svg>
                </div>
              </div>

              {/* Back View */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Back View</p>
                <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-8 aspect-[3/4]">
                  {/* Jersey Back SVG */}
                  <svg viewBox="0 0 300 400" className="w-full h-full">
                    {/* Jersey Body */}
                    <path
                      d="M 50 80 L 50 350 L 250 350 L 250 80 L 220 80 L 220 50 L 200 50 L 200 30 L 100 30 L 100 50 L 80 50 L 80 80 Z"
                      fill="#003C66"
                      stroke="#002244"
                      strokeWidth="2"
                    />
                    {/* Left Sleeve */}
                    <path
                      d="M 50 80 L 10 120 L 10 180 L 50 160 Z"
                      fill="#003C66"
                      stroke="#002244"
                      strokeWidth="2"
                    />
                    {/* Right Sleeve */}
                    <path
                      d="M 250 80 L 290 120 L 290 180 L 250 160 Z"
                      fill="#003C66"
                      stroke="#002244"
                      strokeWidth="2"
                    />

                    {/* Back Top */}
                    <rect
                      x="100"
                      y="90"
                      width="100"
                      height="40"
                      fill={selectedJerseyPosition === 'jersey-back-top' ? '#FC8936' : 'rgba(252, 137, 54, 0.3)'}
                      stroke="#FC8936"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer hover:fill-[#FC8936] transition-all"
                      onClick={() => setSelectedJerseyPosition('jersey-back-top')}
                    />
                    <text x="150" y="115" textAnchor="middle" fill="white" fontSize="10" className="pointer-events-none">
                      UPPER
                    </text>

                    {/* Back Bottom */}
                    <rect
                      x="80"
                      y="280"
                      width="140"
                      height="50"
                      fill={selectedJerseyPosition === 'jersey-back-bottom' ? '#FC8936' : 'rgba(252, 137, 54, 0.3)'}
                      stroke="#FC8936"
                      strokeWidth="2"
                      rx="4"
                      className="cursor-pointer hover:fill-[#FC8936] transition-all"
                      onClick={() => setSelectedJerseyPosition('jersey-back-bottom')}
                    />
                    <text x="150" y="310" textAnchor="middle" fill="white" fontSize="10" className="pointer-events-none">
                      LOWER
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {selectedJerseyPosition && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">
                  Selected: {LOGO_POSITIONS.find(p => p.id === selectedJerseyPosition)?.name}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Assign this position to a sponsorship tier below
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tier List */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Sponsorship Tiers</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom tiers with specific logo placements
                </p>
              </div>
              <Button
                onClick={addNewTier}
                size="sm"
                className="bg-[#003C66] hover:bg-[#002A4A]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tier
              </Button>
            </div>

            {/* Existing Tiers */}
            <div className="space-y-3">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="border rounded-lg p-4 hover:border-[#FC8936] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{tier.name}</h4>
                        <Badge variant="secondary">${tier.price}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Logo Positions:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tier.logoPositions.map((posId) => (
                              <Badge key={posId} variant="outline" className="text-xs">
                                {LOGO_POSITIONS.find(p => p.id === posId)?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {tier.benefits.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Benefits:
                            </p>
                            <ul className="text-sm space-y-1">
                              {tier.benefits.filter(b => b).map((benefit, idx) => (
                                <li key={idx} className="text-muted-foreground">• {benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTier(tier)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTier(tier.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {tiers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tiers created yet</p>
                <p className="text-sm mt-1">Click "Add Tier" to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tier Editor Modal */}
      {editingTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {tiers.find(t => t.id === editingTier.id) ? 'Edit' : 'Create'} Sponsorship Tier
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTier(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Tier Name */}
                <div className="space-y-2">
                  <Label>Tier Name *</Label>
                  <Input
                    placeholder="e.g., Platinum, Gold, Silver"
                    value={editingTier.name}
                    onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label>Price ($) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="e.g., 5000"
                    value={editingTier.price}
                    onChange={(e) => setEditingTier({ ...editingTier, price: Number(e.target.value) })}
                  />
                </div>

                {/* Logo Positions */}
                <div className="space-y-2">
                  <Label>Logo Positions</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Select where sponsor logos will appear
                  </p>
                  
                  {/* Jersey Positions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Jersey</p>
                    <div className="grid grid-cols-2 gap-2">
                      {LOGO_POSITIONS.filter(p => p.category === 'jersey').map((position) => (
                        <div key={position.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={editingTier.logoPositions.includes(position.id)}
                            onCheckedChange={() => toggleLogoPosition(position.id)}
                          />
                          <span className="text-sm">{position.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Poster Positions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Event Poster</p>
                    <div className="grid grid-cols-2 gap-2">
                      {LOGO_POSITIONS.filter(p => p.category === 'poster').map((position) => (
                        <div key={position.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={editingTier.logoPositions.includes(position.id)}
                            onCheckedChange={() => toggleLogoPosition(position.id)}
                          />
                          <span className="text-sm">{position.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Media Positions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Digital & Media</p>
                    <div className="grid grid-cols-2 gap-2">
                      {LOGO_POSITIONS.filter(p => p.category === 'media').map((position) => (
                        <div key={position.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={editingTier.logoPositions.includes(position.id)}
                            onCheckedChange={() => toggleLogoPosition(position.id)}
                          />
                          <span className="text-sm">{position.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Additional Benefits</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addBenefit}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editingTier.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="e.g., VIP booth at event"
                          value={benefit}
                          onChange={(e) => updateBenefit(index, e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBenefit(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingTier(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#003C66] hover:bg-[#002A4A]"
                  onClick={saveTier}
                >
                  Save Tier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
