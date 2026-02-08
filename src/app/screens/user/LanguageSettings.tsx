import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { ChevronLeft, Globe, Check } from 'lucide-react';
import { toast } from 'sonner';

interface LanguageSettingsProps {
  onBack?: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
];

const REGIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
];

export function LanguageSettings({ onBack }: LanguageSettingsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');

  const handleSave = () => {
    toast.success('Language and region settings updated!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Language & Region</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Customize your language and regional preferences
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#003C66]" />
              App Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    selectedLanguage === language.code
                      ? 'border-[#003C66] bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">{language.name}</span>
                    <span className="text-sm text-muted-foreground">{language.native}</span>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="w-5 h-5 text-[#003C66]" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Region Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {REGIONS.map((region) => (
                <button
                  key={region.code}
                  onClick={() => setSelectedRegion(region.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    selectedRegion === region.code
                      ? 'border-[#003C66] bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{region.flag}</span>
                    <span className="font-medium text-gray-900">{region.name}</span>
                  </div>
                  {selectedRegion === region.code && (
                    <Check className="w-5 h-5 text-[#003C66]" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timezone Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Timezone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {TIMEZONES.map((timezone) => (
                <button
                  key={timezone.value}
                  onClick={() => setSelectedTimezone(timezone.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    selectedTimezone === timezone.value
                      ? 'border-[#003C66] bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-gray-900">{timezone.label}</span>
                  {selectedTimezone === timezone.value && (
                    <Check className="w-5 h-5 text-[#003C66]" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
          <Button
            className="w-full bg-primary hover:bg-[#002A4A]"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
