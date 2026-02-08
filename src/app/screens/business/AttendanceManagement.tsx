import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { QRScanner } from '@/app/components/QRScanner';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download,
  ScanLine,
  UserCheck,
  XCircle,
  Calendar,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  ticketNumber: string;
  registeredAt: Date;
  checkedInAt?: Date;
  status: 'registered' | 'checked-in' | 'no-show';
}

interface AttendanceManagementProps {
  activityId: string;
  activityTitle: string;
  activityDate: Date;
  activityTime: string;
  location: string;
  maxParticipants: number;
  onBack: () => void;
}

export function AttendanceManagement({
  activityId,
  activityTitle,
  activityDate,
  activityTime,
  location,
  maxParticipants,
  onBack,
}: AttendanceManagementProps) {
  const [activeTab, setActiveTab] = useState<'scanner' | 'list'>('scanner');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([
    {
      id: 'user-1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      ticketNumber: 'TKT-001',
      registeredAt: new Date('2026-02-01'),
      status: 'registered',
    },
    {
      id: 'user-2',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      ticketNumber: 'TKT-002',
      registeredAt: new Date('2026-02-02'),
      checkedInAt: new Date('2026-02-04T09:30:00'),
      status: 'checked-in',
    },
    {
      id: 'user-3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      ticketNumber: 'TKT-003',
      registeredAt: new Date('2026-02-03'),
      status: 'registered',
    },
    {
      id: 'user-4',
      name: 'Emma Davis',
      email: 'emma@example.com',
      ticketNumber: 'TKT-004',
      registeredAt: new Date('2026-02-03'),
      checkedInAt: new Date('2026-02-04T09:45:00'),
      status: 'checked-in',
    },
  ]);

  const checkedInCount = attendees.filter(a => a.status === 'checked-in').length;
  const registeredCount = attendees.filter(a => a.status === 'registered').length;
  const checkedInUserIds = attendees
    .filter(a => a.status === 'checked-in')
    .map(a => a.id);

  const handleScanSuccess = (result: any) => {
    // Find the attendee
    const attendee = attendees.find(a => a.id === result.userId);
    
    if (attendee) {
      // Update the attendee status
      setAttendees(prev => prev.map(a => 
        a.id === result.userId 
          ? { ...a, status: 'checked-in', checkedInAt: new Date() }
          : a
      ));
      
      toast.success(`${attendee.name} checked in successfully!`);
    } else {
      toast.error('Attendee not found in registration list');
    }
  };

  const handleManualCheckIn = (userId: string) => {
    const attendee = attendees.find(a => a.id === userId);
    
    if (attendee && attendee.status !== 'checked-in') {
      setAttendees(prev => prev.map(a => 
        a.id === userId 
          ? { ...a, status: 'checked-in', checkedInAt: new Date() }
          : a
      ));
      
      toast.success(`${attendee.name} checked in manually`);
    }
  };

  const handleExportList = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Ticket Number', 'Status', 'Checked In At'];
    const rows = attendees.map(a => [
      a.name,
      a.email,
      a.ticketNumber,
      a.status,
      a.checkedInAt ? format(a.checkedInAt, 'yyyy-MM-dd HH:mm:ss') : '-'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activityTitle.replace(/\s+/g, '-')}-attendance.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Attendance list exported');
  };

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Attendance Management</h1>
        
        {/* Activity Info */}
        <Card className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white border-none">
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-3">{activityTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(activityDate, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{activityTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Registered</p>
                <p className="text-2xl font-bold text-[#003C66]">{attendees.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Checked In</p>
                <p className="text-2xl font-bold text-green-600">{checkedInCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{registeredCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="scanner" className="gap-2">
              <ScanLine className="w-4 h-4" />
              QR Scanner
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <Users className="w-4 h-4" />
              Attendee List
            </TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportList}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <TabsContent value="scanner">
          <QRScanner
            activityId={activityId}
            onScanSuccess={handleScanSuccess}
            checkedInUsers={checkedInUserIds}
          />
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendees</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search attendees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAttendees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendees found
                  </div>
                ) : (
                  filteredAttendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#003C66] rounded-full flex items-center justify-center text-white font-semibold">
                          {attendee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-sm text-muted-foreground">{attendee.email}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            {attendee.ticketNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {attendee.status === 'checked-in' ? (
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-1">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Checked In
                            </Badge>
                            {attendee.checkedInAt && (
                              <p className="text-xs text-muted-foreground">
                                {format(attendee.checkedInAt, 'MMM dd, HH:mm')}
                              </p>
                            )}
                          </div>
                        ) : (
                          <>
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              Registered
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleManualCheckIn(attendee.id)}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Check In
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
