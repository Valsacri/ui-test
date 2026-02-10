import { useState } from 'react';
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

export interface ActivityStepFormProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ActivityStepForm({
  currentStep,
  onNext,
  onPrev,
  onCancel,
  onSubmit,
}: ActivityStepFormProps) {
  const [activityType, setActivityType] = useState('');
  const [activityTitle, setActivityTitle] = useState('');
  const [isSponsoredEvent, setIsSponsoredEvent] = useState(false);

  const getTotalSteps = () => {
    return 4;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Select Activity Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActivityType(type.name)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activityType === type.name
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">{type.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Activity Details</h3>
            <div>
              <Label htmlFor="title">Activity Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Basketball Tournament"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Describe the activity..."
                className="w-full h-24 px-3 py-2 border border-border rounded-md text-sm"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Activity Settings</h3>
            <div>
              <Label htmlFor="max-participants">Max Participants</Label>
              <Input
                id="max-participants"
                type="number"
                placeholder="100"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Final Step</h3>
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
                  onCheckedChange={setIsSponsoredEvent}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            {isSponsoredEvent && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Sponsorship Enabled</p>
                    <p className="text-sm text-green-700">A detailed sponsorship form will be shown after creation</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
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
          onClick={currentStep === 1 ? onCancel : onPrev}
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
          onClick={currentStep === getTotalSteps() ? onSubmit : onNext}
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
    </div>
  );
}
