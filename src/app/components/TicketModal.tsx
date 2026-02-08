import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { AttendanceQRCode } from '@/app/components/AttendanceQRCode';
import { Button } from '@/app/components/ui/button';
import { X } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  userId: string;
  activityTitle: string;
  activityDate?: Date;
  activityTime?: string;
  location?: string;
  userName?: string;
}

export function TicketModal({
  isOpen,
  onClose,
  activityId,
  userId,
  activityTitle,
  activityDate,
  activityTime,
  location,
  userName,
}: TicketModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Your Event Ticket</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          <AttendanceQRCode
            activityId={activityId}
            userId={userId}
            activityTitle={activityTitle}
            activityDate={activityDate}
            activityTime={activityTime}
            location={location}
            userName={userName}
          />
          
          <div className="mt-6 text-center">
            <Button
              onClick={onClose}
              className="w-full bg-primary hover:bg-[#002A4A]"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}