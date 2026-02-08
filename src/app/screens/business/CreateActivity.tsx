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
      <div className="bg-white rounded-lg border mb-6 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Create New Activity</h1>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
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