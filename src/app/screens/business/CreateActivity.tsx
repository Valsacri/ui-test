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

export function CreateActivity({ onBack, onSubmit }: CreateActivityProps) {
  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-1">
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

      {/* Form */}
      <ActivityStepForm
        onCancel={onBack}
        onSubmit={onSubmit}
      />
    </div>
  );
}
