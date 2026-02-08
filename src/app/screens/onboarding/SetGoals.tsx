import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { GOAL_CATEGORIES } from '@/app/data/mockData';
import { ArrowLeft, ArrowRight, Check, Activity } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SetGoalsProps {
  onComplete: (goals: string[]) => void;
  onBack: () => void;
}

const STEPS = [
  { label: 'Sports', active: true },
  { label: 'Goals', active: true },
  { label: 'Ready', active: false },
];

export function SetGoals({ onComplete, onBack }: SetGoalsProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleToggle = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      onComplete(selectedGoals);
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
            {STEPS.map((step) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1.5">
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
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10 pb-32">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              What are your goals?
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Select one or more goals. We will use AI to create a personalized plan tailored to your ambitions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {GOAL_CATEGORIES.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);

              return (
                <button
                  key={goal.id}
                  onClick={() => handleToggle(goal.id)}
                  className={cn(
                    "relative p-5 rounded-xl border-2 transition-all text-left",
                    "hover:shadow-sm active:scale-[0.97]",
                    isSelected
                      ? "border-secondary bg-secondary/5"
                      : "border-border bg-card hover:border-secondary/30"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-secondary-foreground" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <span className="text-2xl block">{goal.icon}</span>
                    <h3 className={cn(
                      "text-sm font-semibold",
                      isSelected ? "text-foreground" : "text-foreground"
                    )}>
                      {goal.label}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedGoals.length > 0 && (
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                {selectedGoals.length} {selectedGoals.length === 1 ? 'goal' : 'goals'} selected
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
            disabled={selectedGoals.length === 0}
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
