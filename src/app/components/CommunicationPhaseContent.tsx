import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { DollarSign, Upload, Printer, UserCheck, Megaphone, Radio, Globe, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { AthleteCollaborationSelector } from './AthleteCollaborationSelector';

interface CommunicationPhaseContentProps {
  phase: 'pre' | 'during' | 'post';
  printMedia: boolean;
  onPrintMediaChange: (value: boolean) => void;
  athleteCollab: boolean;
  onAthleteCollabChange: (value: boolean) => void;
  selectedAthlete?: any;
  onSelectAthlete: (athlete: any) => void;
  athleteSearchQuery: string;
  onAthleteSearchChange: (query: string) => void;
  selectedDeliverables: string[];
  onDeliverablesChange: (deliverables: string[]) => void;
}

const phaseConfig = {
  pre: {
    title: 'Pre-Event',
    color: 'blue',
    contentPlaceholder: 'e.g., Share event poster, athlete training videos, countdown posts, sponsor shoutouts, registration reminders',
    mediaLabel: 'Upload Media Content',
    mediaPlaceholder: 'Images, videos (max 50MB)',
    printOptions: ['Flyers', 'Posters', 'Banners', 'Brochures', 'Business Cards'],
    budgetLabel: 'Digital Marketing Budget',
    budgetNote: 'Content creation, ads (excl. influencer fees)'
  },
  during: {
    title: 'During Event',
    color: 'green',
    contentPlaceholder: 'e.g., Live stories, real-time updates, participant highlights, sponsor brand visibility posts, behind-the-scenes',
    mediaLabel: 'Upload Live Event Media',
    mediaPlaceholder: 'Live event templates, graphics',
    printOptions: ['Signage', 'Badges', 'Programs', 'Sponsor Boards', 'Wayfinding Signs'],
    budgetLabel: 'Live Coverage Budget',
    budgetNote: 'Photography, videography, live streaming (excl. influencer fees)'
  },
  post: {
    title: 'Post-Event',
    color: 'purple',
    contentPlaceholder: 'e.g., Event recap video, winner announcements, participant thank you posts, sponsor appreciation, photo gallery, impact metrics',
    mediaLabel: 'Upload Recap Media',
    mediaPlaceholder: 'Recap templates, thank you graphics',
    printOptions: ['Thank You Cards', 'Certificates', 'Event Photos', 'Sponsor Reports', 'Recap Booklets'],
    budgetLabel: 'Post-Event Budget',
    budgetNote: 'Video editing, report design, follow-up (excl. influencer fees)'
  }
};

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { name: 'Website', icon: Globe, color: 'text-gray-600' },
];

export function CommunicationPhaseContent({
  phase,
  printMedia,
  onPrintMediaChange,
  athleteCollab,
  onAthleteCollabChange,
  selectedAthlete,
  onSelectAthlete,
  athleteSearchQuery,
  onAthleteSearchChange,
  selectedDeliverables,
  onDeliverablesChange
}: CommunicationPhaseContentProps) {
  const config = phaseConfig[phase];
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className="space-y-4">
      {/* Section 1: Communication Strategy */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h6 className="font-semibold text-sm text-gray-900">Communication Strategy</h6>
            <p className="text-xs text-gray-500">What's your message and content plan?</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${phase}-content`} className="text-xs font-medium text-gray-700">
              Content & Messaging Plan
            </Label>
            <textarea
              id={`${phase}-content`}
              className="w-full min-h-[80px] px-3 py-2 mt-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#003C66] focus:border-transparent"
              placeholder={config.contentPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor={`${phase}-media`} className="text-xs font-medium text-gray-700 mb-1 block">
              {config.mediaLabel}
            </Label>
            <label 
              htmlFor={`${phase}-media`}
              className="flex items-center justify-center w-full h-20 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FC8936] hover:bg-orange-50 transition-all"
            >
              <div className="text-center">
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600">
                  <span className="text-[#FC8936] font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">{config.mediaPlaceholder}</p>
              </div>
              <input 
                id={`${phase}-media`} 
                type="file" 
                className="hidden" 
                multiple 
                accept="image/*,video/*"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Section 2: Channels & Frequency */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#FC8936] flex items-center justify-center">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div>
            <h6 className="font-semibold text-sm text-gray-900">Channels & Frequency</h6>
            <p className="text-xs text-gray-500">Where and how often will you communicate?</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Platform Selection */}
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-2 block">Social Media Platforms</Label>
            <div className="grid grid-cols-5 gap-2">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    type="button"
                    className="flex flex-col items-center justify-center p-2 border-2 border-gray-200 rounded-lg hover:border-[#003C66] hover:bg-blue-50 transition-all"
                  >
                    <Icon className={`w-5 h-5 mb-1 ${platform.color}`} />
                    <span className="text-xs font-medium text-gray-700">{platform.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`${phase}-frequency`} className="text-xs font-medium text-gray-700">
                Posting Frequency
              </Label>
              <select
                id={`${phase}-frequency`}
                className="w-full h-9 px-3 mt-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#003C66] focus:border-transparent"
              >
                <option>Daily</option>
                <option>Every 2 days</option>
                <option>Weekly</option>
                <option>Bi-weekly</option>
              </select>
            </div>
            <div>
              <Label htmlFor={`${phase}-duration`} className="text-xs font-medium text-gray-700">
                Campaign Duration
              </Label>
              <select
                id={`${phase}-duration`}
                className="w-full h-9 px-3 mt-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#003C66] focus:border-transparent"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>2 months</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Budget & Resources */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <div>
            <h6 className="font-semibold text-sm text-gray-900">Budget & Resources</h6>
            <p className="text-xs text-gray-500">Cost estimates and service providers</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Digital Marketing Budget */}
          <div>
            <Label htmlFor={`${phase}-budget`} className="text-xs font-medium text-gray-700">
              {config.budgetLabel}
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input 
                id={`${phase}-budget`}
                type="number"
                placeholder="0.00"
                className="h-9 text-sm pl-6"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{config.budgetNote}</p>
          </div>

          {/* Print Media Toggle */}
          <div className={`rounded-lg p-3 border ${printMedia ? colorClasses[config.color] : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium flex items-center gap-2 cursor-pointer" htmlFor={`${phase}-print-toggle`}>
                <Printer className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-gray-900">Print Media Materials</p>
                  <p className="text-gray-500 font-normal">Physical promotional materials</p>
                </div>
              </Label>
              <Switch 
                id={`${phase}-print-toggle`}
                checked={printMedia}
                onCheckedChange={onPrintMediaChange}
              />
            </div>
            
            {printMedia && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`${phase}-print-type`} className="text-xs font-medium text-gray-700">Type</Label>
                    <select
                      id={`${phase}-print-type`}
                      className="w-full h-9 px-2 mt-1 border border-gray-300 rounded-md text-sm"
                    >
                      {config.printOptions.map(option => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor={`${phase}-print-units`} className="text-xs font-medium text-gray-700">Quantity</Label>
                    <Input 
                      id={`${phase}-print-units`}
                      type="number"
                      placeholder="0"
                      className="h-9 text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${phase}-print-provider`} className="text-xs font-medium text-gray-700">Service Provider</Label>
                  <select
                    id={`${phase}-print-provider`}
                    className="w-full h-9 px-2 mt-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select provider...</option>
                    <option>PrintHub Co.</option>
                    <option>QuickPrint Services</option>
                    <option>ProDesign Printing</option>
                    <option>FastTrack Media</option>
                    <option>Custom Provider</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor={`${phase}-print-cost`} className="text-xs font-medium text-gray-700">Print Cost</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      id={`${phase}-print-cost`}
                      type="number"
                      placeholder="0.00"
                      className="h-9 text-sm pl-6"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Athlete/Influencer Collaboration Toggle */}
          <div className={`rounded-lg p-3 border ${athleteCollab ? colorClasses[config.color] : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium flex items-center gap-2 cursor-pointer" htmlFor={`${phase}-athlete-toggle`}>
                <UserCheck className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-gray-900">Athlete/Influencer Collaboration</p>
                  <p className="text-gray-500 font-normal">Partner with athletes or influencers</p>
                </div>
              </Label>
              <Switch 
                id={`${phase}-athlete-toggle`}
                checked={athleteCollab}
                onCheckedChange={onAthleteCollabChange}
              />
            </div>
            
            {athleteCollab && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <AthleteCollaborationSelector
                  phase={phase}
                  selectedAthlete={selectedAthlete}
                  onSelectAthlete={onSelectAthlete}
                  searchQuery={athleteSearchQuery}
                  onSearchChange={onAthleteSearchChange}
                  selectedDeliverables={selectedDeliverables}
                  onDeliverablesChange={onDeliverablesChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
