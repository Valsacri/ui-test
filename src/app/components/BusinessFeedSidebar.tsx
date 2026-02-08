import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Building2, TrendingUp, Calendar, Users, DollarSign, Eye, MessageSquare, Star, ArrowUpRight, Plus } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

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
    <div className="space-y-4 sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-4">
      {/* Business Profile Card */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <button 
              onClick={onProfile}
              className="w-20 h-20 bg-[#003C66] rounded-full flex items-center justify-center mb-4 hover:opacity-90 transition-opacity"
            >
              {businessAvatar ? (
                <Avatar className="w-20 h-20">
                  <AvatarImage src={businessAvatar} alt={businessName} />
                  <AvatarFallback className="bg-[#003C66] text-white text-2xl font-bold">
                    {getInitials(businessName)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Building2 className="w-10 h-10 text-white" />
              )}
            </button>
            <h3 className="font-bold text-lg mb-1">{businessName}</h3>
            <p className="text-sm text-gray-600 mb-3">{businessType}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{stats.avgRating}</span>
              <span className="text-xs text-gray-500">(342 reviews)</span>
            </div>

            <Button 
              onClick={onProfile}
              variant="outline" 
              className="w-full text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Business Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#003C66] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Total Revenue</span>
                <span className="text-sm font-bold text-green-600">${stats.totalRevenue}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Active Events</span>
                <span className="text-sm font-bold text-blue-600">{stats.activeEvents}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Total Customers</span>
                <span className="text-sm font-bold text-purple-600">{stats.totalCustomers}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#003C66]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            onClick={onCreateActivity}
            className="w-full justify-start gap-2 bg-[#003C66] hover:bg-[#002A4A]"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Create Activity
          </Button>
          <Button 
            onClick={onCreateCampaign}
            variant="outline"
            className="w-full justify-start gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#003C66]">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs space-y-2">
            <div className="flex items-start gap-2 pb-2 border-b">
              <div className="p-1.5 bg-green-100 rounded mt-0.5">
                <Users className="w-3 h-3 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">5 new bookings</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2 pb-2 border-b">
              <div className="p-1.5 bg-blue-100 rounded mt-0.5">
                <MessageSquare className="w-3 h-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">3 new reviews</p>
                <p className="text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-purple-100 rounded mt-0.5">
                <DollarSign className="w-3 h-3 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">$450 revenue today</p>
                <p className="text-gray-500">Updated 1h ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Tip */}
      <Card className="border-2 border-[#FC8936]/20 bg-gradient-to-br from-orange-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#FC8936]/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-[#FC8936]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Growth Tip</h4>
              <p className="text-xs text-gray-600 mb-2">
                Create more morning activities to attract early birds!
              </p>
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs text-[#FC8936]"
              >
                Learn more <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}