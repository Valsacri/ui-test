import { useState } from 'react';
import { ArrowLeft, Building2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { TopBar } from '@/app/components/TopBar';

interface CreateBusinessProps {
  onBack: () => void;
  onComplete: (businessData: any) => void;
}

const BUSINESS_TYPES = [
  { id: 'gym', label: 'Gym & Fitness Center', icon: '🏋️' },
  { id: 'sports-club', label: 'Sports Club', icon: '⚽' },
  { id: 'yoga-studio', label: 'Yoga Studio', icon: '🧘' },
  { id: 'outdoor', label: 'Outdoor Activities', icon: '🏔️' },
  { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { id: 'equipment', label: 'Equipment Rental', icon: '🎿' },
  { id: 'coaching', label: 'Personal Coaching', icon: '👨‍🏫' },
  { id: 'other', label: 'Other', icon: '🎯' },
];

export function CreateBusiness({ onBack, onComplete }: CreateBusinessProps) {
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState({
    name: '',
    type: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(businessData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return businessData.name && businessData.type;
    }
    if (step === 2) {
      return businessData.address && businessData.city;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Create Business"
        onBack={handleBack}
      />

      <div className="p-4 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">
              {step === 1 && 'Business Info'}
              {step === 2 && 'Location'}
              {step === 3 && 'Contact Details'}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#003C66] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessData.name}
                    onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                    placeholder="e.g., Peak Performance Gym"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Business Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setBusinessData({ ...businessData, type: type.id })}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          businessData.type === type.id
                            ? 'border-[#003C66] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <p className="text-sm font-medium">{type.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={businessData.description}
                    onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                    placeholder="Tell us about your business..."
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Street Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={businessData.address}
                      onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                      placeholder="123 Main Street"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={businessData.city}
                    onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
                    placeholder="San Francisco"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={businessData.email}
                      onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                      placeholder="info@yourbusiness.com"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={businessData.website}
                      onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })}
                      placeholder="https://yourbusiness.com"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex-1 bg-[#003C66] hover:bg-[#002A4A]"
          >
            {step === 3 ? 'Create Business' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
