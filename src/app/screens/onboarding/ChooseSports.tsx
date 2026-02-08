import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { SportSelector } from '@/app/components/SportSelector';
import { SPORTS } from '@/app/data/mockData';
import { ArrowLeft } from 'lucide-react';

interface ChooseSportsProps {
  onComplete: (sports: string[]) => void;
  onBack: () => void;
}

export function ChooseSports({ onComplete, onBack }: ChooseSportsProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const handleToggle = (sportId: string) => {
    setSelectedSports(prev =>
      prev.includes(sportId)
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    );
  };

  const handleContinue = () => {
    if (selectedSports.length > 0) {
      onComplete(selectedSports);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step === 1 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold">What sports interest you?</h1>
            <p className="text-muted-foreground">
              Choose all that apply. We'll personalize your experience based on your interests.
            </p>
          </div>

          <SportSelector
            sports={SPORTS}
            selectedSports={selectedSports}
            onToggle={handleToggle}
          />

          {selectedSports.length > 0 && (
            <p className="text-sm text-center text-muted-foreground">
              {selectedSports.length} {selectedSports.length === 1 ? 'sport' : 'sports'} selected
            </p>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={selectedSports.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
