import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { EXPERIENCE_LEVELS } from '@/app/data/mockData';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface ExperienceLevelProps {
  onComplete: (level: string) => void;
  onBack: () => void;
}

export function ExperienceLevel({ onComplete, onBack }: ExperienceLevelProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const handleContinue = () => {
    if (selectedLevel) {
      onComplete(selectedLevel);
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
                    step <= 2 ? 'bg-blue-600' : 'bg-gray-200'
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
            <h1 className="text-3xl font-bold">What's your experience level?</h1>
            <p className="text-muted-foreground">
              This helps us match you with suitable activities
            </p>
          </div>

          <div className="space-y-3">
            {EXPERIENCE_LEVELS.map((level) => {
              const isSelected = selectedLevel === level.id;
              
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={cn(
                    "w-full p-6 rounded-xl border-2 transition-all text-left",
                    "hover:shadow-md active:scale-[0.98]",
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={cn(
                        "font-semibold text-lg mb-1",
                        isSelected ? "text-blue-700" : "text-gray-900"
                      )}>
                        {level.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {level.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={!selectedLevel}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
