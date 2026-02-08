import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Plus, DollarSign, TrendingUp, Users, Eye, Target, MoreVertical, ChartBar } from 'lucide-react';
import { PageHeader } from '@/app/components/PageHeader';

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
      <PageHeader
        title="Sponsorship & Campaigns"
        subtitle="Manage marketing campaigns and sponsorship deals"
        actions={
          <Button 
            onClick={onCreateCampaign}
            className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Eye className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Social Impact</p>
                <p className="text-2xl font-bold">{(totalReach / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversions</p>
                <p className="text-2xl font-bold">{totalConversions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="w-5 h-5" />
                Active Campaigns
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Currently running marketing campaigns
              </p>
            </div>
            <Badge variant="secondary">{campaigns.filter(c => c.status === 'active').length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <Badge 
                        variant={campaign.status === 'active' ? 'default' : 'secondary'}
                        className={campaign.status === 'active' ? 'bg-green-500' : ''}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {campaign.startDate} - {campaign.endDate}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>

                {/* Campaign Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Spent</p>
                    <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reach</p>
                    <p className="font-semibold">{campaign.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conversions</p>
                    <p className="font-semibold">{campaign.conversions}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Budget Usage</span>
                    <span className="font-medium">{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#003C66] h-2 rounded-full transition-all"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-12">
              <ChartBar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No campaigns yet</p>
              <Button onClick={onCreateCampaign} className="bg-[#FC8936] hover:bg-[#E67A2F]">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="w-5 h-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-medium">Avg. Reach per Campaign</p>
                </div>
                <p className="text-2xl font-bold">
                  {campaigns.length > 0 ? Math.round(totalReach / campaigns.length).toLocaleString() : 0}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-medium">Conversion Rate</p>
                </div>
                <p className="text-2xl font-bold">
                  {totalReach > 0 ? ((totalConversions / totalReach) * 100).toFixed(2) : 0}%
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                  <p className="text-sm font-medium">Cost per Conversion</p>
                </div>
                <p className="text-2xl font-bold">
                  ${totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}