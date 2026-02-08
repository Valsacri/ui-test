import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ActivityStepForm } from '@/app/components/ActivityStepForm';
import { ArrowLeft } from 'lucide-react';

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
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border/60 card-soft mb-6 p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Create New Activity</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Set up your activity details step by step</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Card className="card-soft rounded-xl">
        <CardHeader>
          <CardTitle className="text-foreground">Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityStepForm
            onCancel={onBack}
            onSubmit={onSubmit}
            onMetricsChange={onMetricsChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
