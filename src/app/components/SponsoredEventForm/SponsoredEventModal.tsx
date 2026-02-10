import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { SponsoredEventFormProvider, SponsoredEventForm } from './SponsoredEventForm';

interface SponsoredEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function SponsoredEventModal({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
}: SponsoredEventModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>Create Sponsored Event</DialogTitle>
          <DialogDescription>
            Build a comprehensive sponsored event with all the details, budget, resources, and marketing strategy you need
          </DialogDescription>
        </DialogHeader>
        <SponsoredEventFormProvider>
          <SponsoredEventForm
            onCancel={() => {
              onOpenChange(false);
              onCancel();
            }}
            onSubmit={() => {
              onSubmit({});
              onOpenChange(false);
            }}
          />
        </SponsoredEventFormProvider>
      </DialogContent>
    </Dialog>
  );
}
