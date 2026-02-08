import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { SportSelector, SportWithLevel } from '@/app/components/SportSelector';
import { SPORTS } from '@/app/data/mockData';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react';

interface ChooseSportsProps {
  onComplete: (sports: SportWithLevel[]) => void;
  onBack: () => void;
}

const STEPS = [
  { label: 'Sports', active: true },
  { label: 'Goals', active: false },
  { label: 'Ready', active: false },
];

export function ChooseSports({ onComplete, onBack }: ChooseSportsProps) {
  const [selectedSports, setSelectedSports] = useState<SportWithLevel[]>([]);

  const handleToggle = (sportId: string, level?: 'beginner' | 'intermediate' | 'advanced') => {
    if (level) {
      setSelectedSports(prev => {
        const existing = prev.find(s => s.sportId === sportId);
        if (existing) {
          return prev.map(s =>
            s.sportId === sportId ? { ...s, level } : s
          );
        } else {
          return [...prev, { sportId, level }];
        }
      });
    } else {
      setSelectedSports(prev => prev.filter(s => s.sportId !== sportId));
    }
  };

  const handleContinue = () => {
    if (selectedSports.length > 0) {
      onComplete(selectedSports);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">Sporgates</span>
            </div>
            <div className="w-14" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-1">
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={`h-1.5 w-full rounded-full transition-colors ${
                      step.active ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    step.active ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10 pb-32">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              What sports interest you?
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Choose your favorite sports and set your experience level for each. This helps us personalize your feed and recommendations.
            </p>
          </div>

          <SportSelector
            sports={SPORTS}
            selectedSports={selectedSports}
            onToggle={handleToggle}
          />

          {selectedSports.length > 0 && (
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-medium">
                {selectedSports.length} {selectedSports.length === 1 ? 'sport' : 'sports'} selected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={selectedSports.length === 0}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
