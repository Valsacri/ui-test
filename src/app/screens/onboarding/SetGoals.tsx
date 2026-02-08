import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { GOAL_CATEGORIES } from '@/app/data/mockData';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface SetGoalsProps {
  onComplete: (goals: string[]) => void;
  onBack: () => void;
}

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
                    step <= 3 ? 'bg-blue-600' : 'bg-gray-200'
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
            <h1 className="text-3xl font-bold">What are your goals?</h1>
            <p className="text-muted-foreground">
              Select one or more goals. Our AI will create a personalized plan for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_CATEGORIES.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              
              return (
                <button
                  key={goal.id}
                  onClick={() => handleToggle(goal.id)}
                  className={cn(
                    "relative p-6 rounded-xl border-2 transition-all",
                    "hover:shadow-md active:scale-[0.98]",
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="text-center space-y-2">
                    <div className="text-4xl">{goal.icon}</div>
                    <h3 className={cn(
                      "font-semibold",
                      isSelected ? "text-blue-700" : "text-gray-900"
                    )}>
                      {goal.label}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedGoals.length > 0 && (
            <p className="text-sm text-center text-muted-foreground">
              {selectedGoals.length} {selectedGoals.length === 1 ? 'goal' : 'goals'} selected
            </p>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={selectedGoals.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
