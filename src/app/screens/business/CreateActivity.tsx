import { useState } from 'react';
import { ActivityStepForm } from '@/app/components/ActivityStepForm';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface CreateActivityProps {
  onBack: () => void;
  onSubmit: () => void;
  onMetricsChange?: (metrics: {
    preEventReach: number;
    duringEventReach: number;
    postEventReach: number;
    expectedAttendance: number;
    maxCapacity: number;
  }) => void;
}

export function CreateActivity({ onBack, onSubmit, onMetricsChange }: CreateActivityProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border mb-6 overflow-hidden">
        <div className="bg-primary/[0.03] border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h1 className="text-xl font-semibold text-foreground">Create New Activity</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 ml-7">Set up your event, session, or training program</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6">
          <ActivityStepForm
            currentStep={currentStep}
            onNext={handleNext}
            onPrev={handlePrev}
            onCancel={onBack}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
