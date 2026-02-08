import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Search, Check } from 'lucide-react';
import { MOCK_ATHLETES_INFLUENCERS } from '../data/mockData';

interface Deliverable {
  id: string;
  label: string;
}

const DELIVERABLES: Record<'pre' | 'during' | 'post', Deliverable[]> = {
  pre: [
    { id: 'announcement-posts', label: 'Announcement Posts' },
    { id: 'teaser-content', label: 'Teaser Content' },
    { id: 'stories', label: 'Instagram Stories' },
    { id: 'countdown-posts', label: 'Countdown Posts' },
    { id: 'sponsor-mentions', label: 'Sponsor Mentions' },
    { id: 'giveaway', label: 'Ticket Giveaway' },
    { id: 'training-content', label: 'Training Content' },
    { id: 'event-promo', label: 'Event Promo Video' },
  ],
  during: [
    { id: 'live-appearance', label: 'Live Event Appearance' },
    { id: 'social-posts', label: 'Real-time Social Posts' },
    { id: 'stories', label: 'Instagram Stories' },
    { id: 'photo-ops', label: 'Photo Opportunities' },
    { id: 'sponsor-mentions', label: 'Sponsor Mentions' },
    { id: 'live-stream', label: 'Live Stream Feature' },
    { id: 'bts-content', label: 'Behind-the-Scenes' },
    { id: 'hosting', label: 'Event Hosting/MC' },
  ],
  post: [
    { id: 'thank-you-post', label: 'Thank You Post' },
    { id: 'recap-video', label: 'Event Recap Video' },
    { id: 'highlight-reel', label: 'Highlight Reel Feature' },
    { id: 'testimonial', label: 'Video Testimonial' },
    { id: 'results-share', label: 'Results Announcement' },
    { id: 'photo-carousel', label: 'Photo Carousel' },
    { id: 'sponsor-thanks', label: 'Sponsor Thank You' },
    { id: 'next-event', label: 'Next Event Teaser' },
  ],
};

interface AthleteCollaborationSelectorProps {
  phase: 'pre' | 'during' | 'post';
  selectedAthlete?: any;
  onSelectAthlete: (athlete: any | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDeliverables: string[];
  onDeliverablesChange: (deliverables: string[]) => void;
}

export function AthleteCollaborationSelector({
  phase,
  selectedAthlete,
  onSelectAthlete,
  searchQuery,
  onSearchChange,
  selectedDeliverables,
  onDeliverablesChange,
}: AthleteCollaborationSelectorProps) {
  const deliverables = DELIVERABLES[phase];

  const toggleDeliverable = (deliverableId: string, checked: boolean) => {
    if (checked) {
      onDeliverablesChange([...selectedDeliverables, deliverableId]);
    } else {
      onDeliverablesChange(selectedDeliverables.filter(d => d !== deliverableId));
    }
  };

  return (
    <div className="space-y-3 mt-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Search athletes & influencers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Selected Athlete Display */}
      {selectedAthlete ? (
        <div className="bg-white rounded-lg p-3 border-2 border-green-500">
          <div className="flex items-start gap-3">
            <img 
              src={selectedAthlete.avatar} 
              alt={selectedAthlete.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h6 className="font-medium text-sm">{selectedAthlete.name}</h6>
                {selectedAthlete.verified && (
                  <Check className="w-3 h-3 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-1">{selectedAthlete.handle}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{(selectedAthlete.followers / 1000).toFixed(0)}K followers</span>
                <span>•</span>
                <span>{selectedAthlete.reach}% reach</span>
                <span>•</span>
                <span>${selectedAthlete.baseFee} base fee</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onSelectAthlete(undefined)}
            >
              ✕
            </Button>
          </div>
          
          {/* Deliverables Options */}
          <div className="mt-3">
            <Label className="text-xs mb-2 block">Deliverables</Label>
            <div className="grid grid-cols-2 gap-2">
              {deliverables.map((deliverable) => (
                <Label 
                  key={deliverable.id}
                  className="flex items-center gap-2 text-xs font-normal cursor-pointer hover:text-green-700"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={selectedDeliverables.includes(deliverable.id)}
                    onChange={(e) => toggleDeliverable(deliverable.id, e.target.checked)}
                  />
                  {deliverable.label}
                </Label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Athlete Selection Cards */
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {MOCK_ATHLETES_INFLUENCERS
            .filter(athlete => 
              searchQuery === '' ||
              athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              athlete.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
              athlete.sport.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((athlete) => (
              <div
                key={athlete.id}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-400 hover:shadow-sm cursor-pointer transition-all"
                onClick={() => onSelectAthlete(athlete)}
              >
                <div className="flex items-start gap-3">
                  <img 
                    src={athlete.avatar} 
                    alt={athlete.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h6 className="font-medium text-sm truncate">{athlete.name}</h6>
                      {athlete.verified && (
                        <Check className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{athlete.handle}</p>
                    <p className="text-xs text-gray-500 mb-2">{athlete.bio}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{athlete.sport}</span>
                      <span className="text-gray-500">{(athlete.followers / 1000).toFixed(0)}K</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-600 font-medium">${athlete.baseFee}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
