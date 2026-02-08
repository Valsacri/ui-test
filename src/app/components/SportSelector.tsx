import { Check } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

interface Sport {
  id: string;
  name: string;
  icon: string;
}

export interface SportWithLevel {
  sportId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface SportSelectorProps {
  sports: Sport[];
  selectedSports: SportWithLevel[];
  onToggle: (sportId: string, level?: 'beginner' | 'intermediate' | 'advanced') => void;
  multiSelect?: boolean;
}

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', label: 'Advanced', description: 'Experienced player' },
] as const;

export function SportSelector({
  sports,
  selectedSports,
  onToggle,
  multiSelect = true
}: SportSelectorProps) {
  const [showLevelSelector, setShowLevelSelector] = useState<string | null>(null);

  const handleSportClick = (sportId: string) => {
    const isSelected = selectedSports.some(s => s.sportId === sportId);
    
    if (isSelected) {
      // If already selected, remove it
      onToggle(sportId);
    } else {
      // If not selected, show level selector
      setShowLevelSelector(sportId);
    }
  };

  const handleLevelSelect = (sportId: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    onToggle(sportId, level);
    setShowLevelSelector(null);
  };

  const getSportLevel = (sportId: string): string | undefined => {
    const sport = selectedSports.find(s => s.sportId === sportId);
    return sport?.level;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sports.map((sport) => {
          const sportLevel = getSportLevel(sport.id);
          const isSelected = !!sportLevel;
          
          return (
            <button
              key={sport.id}
              onClick={() => handleSportClick(sport.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                "hover:shadow-md active:scale-95",
                isSelected
                  ? "border-[#FC8936] bg-[#FC8936]/5 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#FC8936] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="text-3xl mb-2">{sport.icon}</div>
              <span className={cn(
                "text-sm font-medium text-center",
                isSelected ? "text-[#003C66]" : "text-gray-700"
              )}>
                {sport.name}
              </span>
              {isSelected && sportLevel && (
                <span className="text-xs text-[#FC8936] mt-1 capitalize">
                  {sportLevel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Experience Level Selector Modal */}
      {showLevelSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-[#003C66]">
                Select your experience level
              </h3>
              <p className="text-sm text-muted-foreground">
                for {sports.find(s => s.id === showLevelSelector)?.name}
              </p>
            </div>

            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(showLevelSelector, level.id)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#FC8936] hover:bg-[#FC8936]/5 transition-all"
                >
                  <div className="font-medium text-[#003C66]">{level.label}</div>
                  <div className="text-sm text-muted-foreground">{level.description}</div>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowLevelSelector(null)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}