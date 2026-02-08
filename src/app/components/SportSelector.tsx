import { Check, X } from 'lucide-react';
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
  { id: 'beginner', label: 'Beginner', description: 'Just getting started' },
  { id: 'intermediate', label: 'Intermediate', description: 'Play regularly' },
  { id: 'advanced', label: 'Advanced', description: 'Competitive level' },
] as const;

export function SportSelector({
  sports,
  selectedSports,
  onToggle,
}: SportSelectorProps) {
  const [showLevelSelector, setShowLevelSelector] = useState<string | null>(null);

  const handleSportClick = (sportId: string) => {
    const isSelected = selectedSports.some(s => s.sportId === sportId);

    if (isSelected) {
      onToggle(sportId);
    } else {
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
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {sports.map((sport) => {
          const sportLevel = getSportLevel(sport.id);
          const isSelected = !!sportLevel;

          return (
            <button
              key={sport.id}
              onClick={() => handleSportClick(sport.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                "hover:shadow-sm active:scale-[0.97]",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="text-2xl mb-1.5">{sport.icon}</div>
              <span className={cn(
                "text-xs font-medium text-center leading-tight",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {sport.name}
              </span>
              {isSelected && sportLevel && (
                <span className="text-[10px] text-secondary mt-0.5 capitalize font-medium">
                  {sportLevel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Experience Level Modal */}
      {showLevelSelector && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  Experience level
                </h3>
                <button
                  onClick={() => setShowLevelSelector(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                for {sports.find(s => s.id === showLevelSelector)?.name}
              </p>
            </div>

            <div className="px-6 pb-2 space-y-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(showLevelSelector, level.id)}
                  className="w-full text-left p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {level.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{level.description}</div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-primary transition-colors flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowLevelSelector(null)}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
