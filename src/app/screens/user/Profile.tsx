import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { 
  User, 
  Building2, 
  Settings, 
  Bell, 
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Trophy
} from 'lucide-react';

interface ProfileProps {
  userType: 'user' | 'business';
  onSwitchUserType: (type: 'user' | 'business') => void;
  selectedSports: string[];
  experienceLevel: string;
  goals: string[];
}

export function Profile({ 
  userType, 
  onSwitchUserType,
  selectedSports,
  experienceLevel,
  goals 
}: ProfileProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#003C66] text-white pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 border-4 border-white/30">
              JD
            </div>
            <h1 className="text-2xl font-bold mb-1">John Doe</h1>
            <p className="text-white/80 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              john@example.com
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 space-y-4">
        {/* Profile Type Switcher */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Profile Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSwitchUserType('user')}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  userType === 'user'
                    ? 'border-[#003C66] bg-[#003C66]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    userType === 'user' ? 'bg-[#003C66] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Personal</p>
                    <p className="text-xs text-muted-foreground">Join activities</p>
                  </div>
                </div>
                {userType === 'user' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-[#003C66] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>

              <button
                onClick={() => onSwitchUserType('business')}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  userType === 'business'
                    ? 'border-[#FC8936] bg-[#FC8936]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    userType === 'business' ? 'bg-[#FC8936] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Business</p>
                    <p className="text-xs text-muted-foreground">Organize & sponsor</p>
                  </div>
                </div>
                {userType === 'business' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-[#FC8936] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Switch between personal and business profiles anytime
            </p>
          </CardContent>
        </Card>

        {/* Profile Stats (Personal View) */}
        {userType === 'user' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Your Activity</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{selectedSports.length}</p>
                  <p className="text-sm text-muted-foreground">Sports</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{goals.length}</p>
                  <p className="text-sm text-muted-foreground">Goals</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-sm text-muted-foreground">Activities</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience Level</span>
                  <Badge variant="secondary" className="capitalize">{experienceLevel || 'Not set'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">January 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Business Stats (Business View) */}
        {userType === 'business' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Business Performance</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">8</p>
                  <p className="text-sm text-muted-foreground">Events</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">340</p>
                  <p className="text-sm text-muted-foreground">Participants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">2</p>
                  <p className="text-sm text-muted-foreground">Campaigns</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Type</span>
                  <Badge variant="secondary">Gym & Fitness</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Trophy className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">john@example.com</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <Separator />
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <Separator />
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">New York, NY</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Preferences */}
        <Card>
          <CardContent className="p-0">
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left font-medium">Notifications</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <Separator />
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left font-medium">Privacy & Security</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <Separator />
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left font-medium">Payment Methods</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <Separator />
            <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left font-medium">Help & Support</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Sporgates v1.0.0
        </p>
      </div>
    </div>
  );
}