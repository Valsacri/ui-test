import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Plus, DollarSign, TrendingUp, Eye, Target, BarChart3 } from 'lucide-react';

interface BusinessCampaignsProps {
  onCreateCampaign?: () => void;
}

export function BusinessCampaigns({ onCreateCampaign }: BusinessCampaignsProps) {
  const campaigns = [
    {
      id: '1',
      name: 'Summer Fitness Challenge',
      status: 'active',
      budget: 5000,
      spent: 3200,
      reach: 12500,
      conversions: 245,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
    },
    {
      id: '2',
      name: 'Marathon Training Program',
      status: 'active',
      budget: 3000,
      spent: 1800,
      reach: 8400,
      conversions: 156,
      startDate: '2024-07-01',
      endDate: '2024-09-30',
    },
  ];

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage marketing campaigns and sponsorship deals</p>
        </div>
        <Button 
          onClick={onCreateCampaign}
          size="sm"
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: DollarSign, label: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: TrendingUp, label: 'Spent', value: `$${totalSpent.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Eye, label: 'Social Impact', value: `${(totalReach / 1000).toFixed(1)}K`, color: 'text-secondary', bg: 'bg-secondary/10' },
          { icon: Target, label: 'Conversions', value: totalConversions.toString(), color: 'text-primary', bg: 'bg-primary/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Campaigns */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4 text-primary" />
              Active Campaigns
            </CardTitle>
            <Badge variant="secondary" className="text-xs">{campaigns.filter(c => c.status === 'active').length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-border rounded-xl p-5 hover:shadow-sm transition-all bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                      <Badge 
                        className={`text-[10px] border-0 ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {campaign.startDate} - {campaign.endDate}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    View Details
                  </Button>
                </div>

                {/* Campaign Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Budget', value: `$${campaign.budget.toLocaleString()}` },
                    { label: 'Spent', value: `$${campaign.spent.toLocaleString()}` },
                    { label: 'Reach', value: campaign.reach.toLocaleString() },
                    { label: 'Conversions', value: campaign.conversions.toString() },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                      <p className="text-sm font-semibold text-foreground">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Budget Usage</span>
                    <span className="font-semibold text-foreground">{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-1">No campaigns yet</p>
              <p className="text-xs text-muted-foreground mb-4">Create your first campaign to start reaching your audience</p>
              <Button onClick={onCreateCampaign} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Plus className="w-4 h-4 mr-1.5" />
                Create Your First Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Eye, label: 'Avg. Reach per Campaign', value: campaigns.length > 0 ? Math.round(totalReach / campaigns.length).toLocaleString() : '0', color: 'text-primary' },
              { icon: Target, label: 'Conversion Rate', value: `${totalReach > 0 ? ((totalConversions / totalReach) * 100).toFixed(2) : 0}%`, color: 'text-green-600' },
              { icon: DollarSign, label: 'Cost per Conversion', value: `$${totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : 0}`, color: 'text-secondary' },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="p-4 bg-muted rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                    <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
