import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { PageHeader } from '@/app/components/PageHeader';

export function BusinessAnalytics() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        title="Analytics"
        subtitle="Performance metrics and insights"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">$29,700</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Participants</p>
                <p className="text-2xl font-bold">420</p>
                <p className="text-xs text-green-600 mt-1">+18% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Activities Hosted</p>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-green-600 mt-1">+8 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile Views</p>
                <p className="text-2xl font-bold">1,245</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">+15% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Attendance</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Across all activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Satisfaction</p>
                <p className="text-2xl font-bold">4.8/5</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Based on 156 reviews</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}