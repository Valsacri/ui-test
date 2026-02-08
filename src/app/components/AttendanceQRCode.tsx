import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Download, Share2, Calendar, MapPin, Clock, QrCode } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceQRCodeProps {
  activityId: string;
  userId: string;
  activityTitle: string;
  activityDate?: Date;
  activityTime?: string;
  location?: string;
  ticketNumber?: string;
  userName?: string;
  onDownload?: () => void;
  onShare?: () => void;
}

export function AttendanceQRCode({
  activityId,
  userId,
  activityTitle,
  activityDate,
  activityTime,
  location,
  ticketNumber = `TKT-${Date.now()}`,
  userName = 'Participant',
  onDownload,
  onShare,
}: AttendanceQRCodeProps) {
  // Generate QR code data with attendance information
  const qrData = JSON.stringify({
    type: 'SPORGATES_ATTENDANCE',
    activityId,
    userId,
    ticketNumber,
    timestamp: new Date().toISOString(),
    version: '1.0'
  });

  const handleDownload = () => {
    // Get the QR code SVG
    const svg = document.getElementById('attendance-qr-code');
    if (!svg) return;

    // Create a canvas and convert SVG to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = `${activityTitle.replace(/\s+/g, '-')}-ticket.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      });
    };

    img.src = url;
    if (onDownload) onDownload();
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="w-5 h-5 text-[#003C66]" />
          <CardTitle className="text-lg">Event Ticket</CardTitle>
        </div>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Confirmed
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Activity Info */}
        <div className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white rounded-lg p-4">
          <h3 className="font-bold text-lg mb-3">{activityTitle}</h3>
          
          <div className="space-y-2 text-sm">
            {activityDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(activityDate, 'EEEE, MMMM dd, yyyy')}</span>
              </div>
            )}
            {activityTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{activityTime}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-lg border-2 border-[#003C66]/20">
          <div className="flex justify-center">
            <QRCodeSVG
              id="attendance-qr-code"
              value={qrData}
              size={200}
              level="H"
              includeMargin={true}
              fgColor="#003C66"
            />
          </div>
          
          {/* Ticket Number */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Ticket Number</p>
            <p className="font-mono font-semibold text-sm">{ticketNumber}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900 font-medium mb-1">Check-in Instructions</p>
          <p className="text-xs text-blue-700">
            Show this QR code to the event organizer upon arrival. They will scan it to confirm your attendance.
          </p>
        </div>

        {/* Participant Info */}
        <div className="border-t pt-3 text-center text-sm text-muted-foreground">
          <p>Ticket holder: <span className="font-medium text-gray-900">{userName}</span></p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
