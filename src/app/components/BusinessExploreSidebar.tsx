import { Card, CardContent } from '@/app/components/ui/card';
import { 
  LayoutDashboard, Calendar, Users, Package, TrendingUp, Settings, 
  Megaphone, Briefcase, Building2, BarChart3, UserCheck, Plus 
} from 'lucide-react';
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
      destination: 'business-dashboard',
    },
    {
      id: 'activities',
      icon: Calendar,
      label: 'Activities',
      destination: 'business-activities',
    },
    {
      id: 'campaigns',
      icon: Megaphone,
      label: 'Campaigns',
      destination: 'business-campaigns',
    },
    {
      id: 'customers',
      icon: Users,
      label: 'Customers',
      destination: 'business-customers',
    },
    {
      id: 'resources',
      icon: Package,
      label: 'Resources',
      destination: 'business-resources',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      destination: 'business-analytics',
    },
    {
      id: 'athletes',
      icon: UserCheck,
      label: 'Athletes',
      destination: 'business-athletes',
    },
    {
      id: 'businesses',
      icon: Building2,
      label: 'Partners',
      destination: 'business-partners',
    },
    {
      id: 'team',
      icon: Briefcase,
      label: 'Team',
      destination: 'business-team',
    },
  ];

  return (
    <div className="space-y-4 sticky top-[3.75rem] max-h-[calc(100vh-3.75rem)] overflow-y-auto pb-4">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          className="flex-1 bg-primary hover:bg-primary/90 gap-1.5 h-9 text-xs"
          onClick={() => onNavigate?.('create-activity')}
        >
          <Plus className="w-3.5 h-3.5" />
          Activity
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1 gap-1.5 h-9 text-xs border-secondary text-secondary hover:bg-secondary/10"
          onClick={() => onNavigate?.('create-campaign')}
        >
          <Plus className="w-3.5 h-3.5" />
          Campaign
        </Button>
      </div>

      {/* Navigation */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-2">
          <nav className="space-y-0.5">
            {businessItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.destination || 
                (!currentPage && item.id === 'dashboard') ||
                (currentPage === 'business' && item.id === 'dashboard');
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.destination)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                    isActive 
                      ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                      : 'text-foreground hover:bg-muted font-normal'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Stats</h4>
          <div className="space-y-2.5">
            {[
              { icon: TrendingUp, label: 'Revenue', value: '$2,450', color: 'text-green-600' },
              { icon: Calendar, label: 'Active Events', value: '8', color: 'text-primary' },
              { icon: Users, label: 'Customers', value: '245', color: 'text-secondary' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Button 
        variant="ghost" 
        className="w-full justify-start gap-2.5 text-sm text-muted-foreground hover:text-foreground h-10"
        onClick={() => onNavigate?.('business-settings')}
      >
        <Settings className="w-4 h-4" />
        Settings
      </Button>
    </div>
  );
}
