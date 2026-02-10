import { createContext, useContext, useState, ReactNode } from 'react';

export interface SponsorshipTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  visibility: 'high' | 'medium' | 'low';
}

export interface SelectedResource {
  id: string;
  name: string;
  type: 'facility' | 'product' | 'service';
  price: number;
  isExternal?: boolean;
}

export interface EventStaff {
  id: string;
  name: string;
  role: string;
  isExternal?: boolean;
}

export interface MarketingPhase {
  phase: 'pre' | 'during' | 'post';
  channels: string[];
  messaging: string;
  reach?: number;
}

export interface SponsoredEventFormData {
  // Event Details
  eventName: string;
  eventType: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  location: string;
  targetAudience: string;
  expectedAttendance: number;

  // Budget & Sponsorship
  totalBudget: number;
  sponsorshipGoal: number;
  sponsorshipTiers: SponsorshipTier[];
  
  // Resources, Partners, Staff
  selectedResources: SelectedResource[];
  selectedPartners: any[];
  selectedStaff: EventStaff[];
  
  // Marketing Timeline
  marketingPhases: MarketingPhase[];
  
  // Program & Activities
  programActivities: any[];
}

interface SponsoredEventFormContextType {
  formData: SponsoredEventFormData;
  updateFormData: (updates: Partial<SponsoredEventFormData>) => void;
  updateSection: (section: keyof SponsoredEventFormData, data: any) => void;
  resetForm: () => void;
}

const defaultFormData: SponsoredEventFormData = {
  eventName: '',
  eventType: '',
  eventDescription: '',
  startDate: '',
  endDate: '',
  location: '',
  targetAudience: '',
  expectedAttendance: 0,
  totalBudget: 0,
  sponsorshipGoal: 0,
  sponsorshipTiers: [],
  selectedResources: [],
  selectedPartners: [],
  selectedStaff: [],
  marketingPhases: [
    { phase: 'pre', channels: [], messaging: '', reach: 0 },
    { phase: 'during', channels: [], messaging: '', reach: 0 },
    { phase: 'post', channels: [], messaging: '', reach: 0 },
  ],
  programActivities: [],
};

const SponsoredEventFormContext = createContext<SponsoredEventFormContextType | undefined>(undefined);

export function SponsoredEventFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<SponsoredEventFormData>(defaultFormData);

  const updateFormData = (updates: Partial<SponsoredEventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateSection = (section: keyof SponsoredEventFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  return (
    <SponsoredEventFormContext.Provider value={{ formData, updateFormData, updateSection, resetForm }}>
      {children}
    </SponsoredEventFormContext.Provider>
  );
}

export function useSponsoredEventForm() {
  const context = useContext(SponsoredEventFormContext);
  if (context === undefined) {
    throw new Error('useSponsoredEventForm must be used within SponsoredEventFormProvider');
  }
  return context;
}
