import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Building2, TrendingUp, Calendar, Users, DollarSign, Eye, MessageSquare, Star, ArrowUpRight, Plus } from 'lucide-react';

interface BusinessFeedSidebarProps {
  businessName?: string;
  businessType?: string;
  businessAvatar?: string;
  stats?: {
    totalRevenue: number;
    activeEvents: number;
    totalCustomers: number;
    avgRating: number;
  };
  onProfile?: () => void;
  onCreateActivity?: () => void;
  onCreateCampaign?: () => void;
}

export function BusinessFeedSidebar({
  businessName = 'Peak Performance Gym',
  businessType = 'Fitness Center',
  businessAvatar,
  stats = {
    totalRevenue: 2450,
    activeEvents: 8,
    totalCustomers: 245,
    avgRating: 4.8,
  },
  onProfile,
  onCreateActivity,
  onCreateCampaign,
}: BusinessFeedSidebarProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4 sticky top-[3.75rem] max-h-[calc(100vh-3.75rem)] overflow-y-auto pb-4">
      {/* Business Profile Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col items-center text-center">
            <button 
              onClick={onProfile}
              className="mb-3 hover:opacity-90 transition-opacity"
            >
              <Avatar className="w-16 h-16 rounded-xl">
                <AvatarImage src={businessAvatar} alt={businessName} className="rounded-xl" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold rounded-xl">
                  {getInitials(businessName)}
                </AvatarFallback>
              </Avatar>
            </button>
            <h3 className="font-semibold text-base text-foreground mb-0.5">{businessName}</h3>
            <p className="text-xs text-muted-foreground mb-2">{businessType}</p>
            
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
              <span className="font-semibold text-sm text-foreground">{stats.avgRating}</span>
              <span className="text-xs text-muted-foreground">(342)</span>
            </div>

            <Button 
              onClick={onProfile}
              variant="outline" 
              className="w-full text-xs h-8"
              size="sm"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          {[
            { label: 'Revenue', value: `$${stats.totalRevenue}`, color: 'bg-green-500', pct: 75 },
            { label: 'Active Events', value: stats.activeEvents.toString(), color: 'bg-primary', pct: 60 },
            { label: 'Customers', value: stats.totalCustomers.toString(), color: 'bg-secondary', pct: 85 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-3 space-y-2">
          <Button 
            onClick={onCreateActivity}
            className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 h-9 text-xs"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Activity
          </Button>
          <Button 
            onClick={onCreateCampaign}
            variant="outline"
            className="w-full justify-start gap-2 h-9 text-xs"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Campaign
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2.5">
          {[
            { icon: Users, label: '5 new bookings', time: '2h ago', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: MessageSquare, label: '3 new reviews', time: '5h ago', color: 'text-primary', bg: 'bg-primary/10' },
            { icon: DollarSign, label: '$450 revenue today', time: '1h ago', color: 'text-secondary', bg: 'bg-secondary/10' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2.5">
                <div className={`w-7 h-7 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Growth Tip */}
      <Card className="border-secondary/20 overflow-hidden shadow-sm">
        <div className="bg-secondary/5 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h4 className="font-medium text-xs text-foreground mb-1">Growth Tip</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                Create more morning activities to attract early birds!
              </p>
              <Button 
                variant="link" 
                className="h-auto p-0 text-[11px] text-secondary"
              >
                Learn more <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
