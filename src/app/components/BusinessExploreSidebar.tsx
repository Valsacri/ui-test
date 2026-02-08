import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { LayoutDashboard, Calendar, Users, Package, TrendingUp, Settings, Megaphone, Briefcase, ChevronRight, BarChart3, DollarSign, UserCheck, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface BusinessExploreSidebarProps {
  onNavigate?: (destination: string) => void;
  currentPage?: string;
}

export function BusinessExploreSidebar({ onNavigate, currentPage }: BusinessExploreSidebarProps) {
  const businessItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & insights',
      color: 'bg-[#003C66] text-white',
      destination: 'business-dashboard',
    },
    {
      id: 'activities',
      icon: Calendar,
      label: 'Activities',
      description: 'Manage events & sessions',
      color: 'bg-[#003C66] text-white',
      destination: 'business-activities',
    },
    {
      id: 'campaigns',
      icon: Megaphone,
      label: 'Campaigns',
      description: 'Sponsorship & marketing',
      color: 'bg-[#003C66] text-white',
      destination: 'business-campaigns',
    },
    {
      id: 'customers',
      icon: Users,
      label: 'Customers',
      description: 'Manage relationships',
      color: 'bg-[#003C66] text-white',
      destination: 'business-customers',
    },
    {
      id: 'resources',
      icon: Package,
      label: 'Resources',
      description: 'Products & facilities',
      color: 'bg-[#003C66] text-white',
      destination: 'business-resources',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      description: 'Performance metrics',
      color: 'bg-[#003C66] text-white',
      destination: 'business-analytics',
    },
    {
      id: 'athletes',
      icon: UserCheck,
      label: 'Athletes & Influencers',
      description: 'Collaboration partners',
      color: 'bg-[#003C66] text-white',
      destination: 'business-athletes',
    },
    {
      id: 'businesses',
      icon: Building2,
      label: 'Businesses',
      description: 'Business partnerships',
      color: 'bg-[#003C66] text-white',
      destination: 'business-partners',
    },
    {
      id: 'team',
      icon: Briefcase,
      label: 'Team',
      description: 'Staff & permissions',
      color: 'bg-[#003C66] text-white',
      destination: 'business-team',
    },
  ];

  const handleItemClick = (destination: string) => {
    if (onNavigate) {
      onNavigate(destination);
    }
  };

  return (
    <div className="space-y-4 sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-4">
      {/* Quick Actions Card */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#003C66]">Business Hub</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {businessItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.destination;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.destination)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-[#003C66] text-white shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#003C66]'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#003C66]">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Revenue</span>
            </div>
            <span className="font-semibold text-sm">$2,450</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Active Events</span>
            </div>
            <span className="font-semibold text-sm">8</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Customers</span>
            </div>
            <span className="font-semibold text-sm">245</span>
          </div>
        </CardContent>
      </Card>

      {/* Settings Quick Link */}
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2"
        onClick={() => handleItemClick('business-settings')}
      >
        <Settings className="w-4 h-4" />
        Settings
      </Button>
    </div>
  );
}