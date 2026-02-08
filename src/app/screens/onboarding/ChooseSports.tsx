import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { SportSelector, SportWithLevel } from '@/app/components/SportSelector';
import { SPORTS } from '@/app/data/mockData';
import { ArrowLeft } from 'lucide-react';

interface ChooseSportsProps {
  onComplete: (sports: SportWithLevel[]) => void;
  onBack: () => void;
}

export function ChooseSports({ onComplete, onBack }: ChooseSportsProps) {
  const [selectedSports, setSelectedSports] = useState<SportWithLevel[]>([]);

  const handleToggle = (sportId: string, level?: 'beginner' | 'intermediate' | 'advanced') => {
    if (level) {
      // Add or update sport with level
      setSelectedSports(prev => {
        const existing = prev.find(s => s.sportId === sportId);
        if (existing) {
          // Update level
          return prev.map(s => 
            s.sportId === sportId ? { ...s, level } : s
          );
        } else {
          // Add new sport with level
          return [...prev, { sportId, level }];
        }
      });
    } else {
      // Remove sport
      setSelectedSports(prev => prev.filter(s => s.sportId !== sportId));
    }
  };

  const handleContinue = () => {
    if (selectedSports.length > 0) {
      onComplete(selectedSports);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      step === 1 ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold text-[#003C66]">What sports interest you?</h1>
            <p className="text-muted-foreground">
              Choose your sports and set your experience level for each one.
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={selectedSports.length === 0}
            className="w-full bg-gradient-to-r from-[#003C66] to-[#FC8936] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}