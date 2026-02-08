import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Camera, CameraOff, CheckCircle2, XCircle, ScanLine, AlertCircle } from 'lucide-react';

interface ScanResult {
  ticketNumber: string;
  userId: string;
  activityId: string;
  timestamp: string;
  userName?: string;
  status: 'valid' | 'invalid' | 'duplicate';
  message?: string;
}

interface QRScannerProps {
  activityId: string;
  onScanSuccess?: (result: ScanResult) => void;
  onScanError?: (error: string) => void;
  checkedInUsers?: string[];
}

export function QRScanner({ 
  activityId, 
  onScanSuccess, 
  onScanError,
  checkedInUsers = []
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const startScanning = async () => {
    try {
      setError('');
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore continuous scan errors (these are expected)
        }
      );

      setIsScanning(true);
    } catch (err) {
      setError('Failed to start camera. Please ensure camera permissions are granted.');
      if (onScanError) {
        onScanError('Camera access denied');
      }
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);

      // Validate QR code format
      if (data.type !== 'SPORGATES_ATTENDANCE') {
        setLastScan({
          ticketNumber: 'UNKNOWN',
          userId: '',
          activityId: '',
          timestamp: new Date().toISOString(),
          status: 'invalid',
          message: 'Invalid QR code format'
        });
        if (onScanError) onScanError('Invalid QR code');
        return;
      }

      // Validate activity ID
      if (data.activityId !== activityId) {
        setLastScan({
          ticketNumber: data.ticketNumber,
          userId: data.userId,
          activityId: data.activityId,
          timestamp: data.timestamp,
          status: 'invalid',
          message: 'This ticket is for a different event'
        });
        if (onScanError) onScanError('Wrong event ticket');
        return;
      }

      // Check for duplicate check-in
      if (checkedInUsers.includes(data.userId)) {
        setLastScan({
          ticketNumber: data.ticketNumber,
          userId: data.userId,
          activityId: data.activityId,
          timestamp: data.timestamp,
          status: 'duplicate',
          message: 'Already checked in'
        });
        if (onScanError) onScanError('User already checked in');
        return;
      }

      // Valid check-in
      const result: ScanResult = {
        ticketNumber: data.ticketNumber,
        userId: data.userId,
        activityId: data.activityId,
        timestamp: data.timestamp,
        status: 'valid',
        message: 'Check-in successful'
      };

      setLastScan(result);
      if (onScanSuccess) onScanSuccess(result);

      // Auto-clear the result after 3 seconds
      setTimeout(() => setLastScan(null), 3000);
    } catch (err) {
      setLastScan({
        ticketNumber: 'ERROR',
        userId: '',
        activityId: '',
        timestamp: new Date().toISOString(),
        status: 'invalid',
        message: 'Unable to read QR code'
      });
      if (onScanError) onScanError('Invalid QR code data');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-[#003C66]" />
          Attendance Scanner
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Scanner View */}
        <div className="relative">
          <div
            id={qrCodeRegionId}
            className={`rounded-lg overflow-hidden border-2 ${
              isScanning ? 'border-[#003C66]' : 'border-gray-300'
            }`}
            style={{ minHeight: '300px' }}
          >
            {!isScanning && (
              <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100">
                <Camera className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-sm text-muted-foreground">Camera not active</p>
              </div>
            )}
          </div>

          {/* Scanning Indicator */}
          {isScanning && (
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Scanning
            </div>
          )}
        </div>

        {/* Scan Result */}
        {lastScan && (
          <Alert className={`
            ${lastScan.status === 'valid' ? 'border-green-500 bg-green-50' : ''}
            ${lastScan.status === 'duplicate' ? 'border-yellow-500 bg-yellow-50' : ''}
            ${lastScan.status === 'invalid' ? 'border-red-500 bg-red-50' : ''}
          `}>
            <div className="flex items-start gap-3">
              {lastScan.status === 'valid' && (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              {lastScan.status === 'duplicate' && (
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              )}
              {lastScan.status === 'invalid' && (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              
              <div className="flex-1">
                <AlertDescription className={`
                  ${lastScan.status === 'valid' ? 'text-green-900' : ''}
                  ${lastScan.status === 'duplicate' ? 'text-yellow-900' : ''}
                  ${lastScan.status === 'invalid' ? 'text-red-900' : ''}
                `}>
                  <p className="font-semibold mb-1">{lastScan.message}</p>
                  <p className="text-xs opacity-90">
                    Ticket: {lastScan.ticketNumber}
                  </p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-900">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="space-y-3">
          {!isScanning ? (
            <Button
              onClick={startScanning}
              className="w-full bg-[#003C66] hover:bg-[#002A4A]"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Scanner
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="outline"
              className="w-full"
            >
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Scanner
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#003C66]">
              {checkedInUsers.length}
            </p>
            <p className="text-xs text-muted-foreground">Checked In</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {isScanning ? 'Active' : 'Inactive'}
            </p>
            <p className="text-xs text-muted-foreground">Scanner Status</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
