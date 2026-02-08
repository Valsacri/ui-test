import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Plus, Users, Search, Crown, TrendingUp, Heart, Settings } from 'lucide-react';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface BusinessCustomersProps {
  onManageCustomers?: () => void;
}

export function BusinessCustomers({ onManageCustomers }: BusinessCustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        title="Customers"
        subtitle="Manage customer relationships and insights"
        actions={
          <Button 
            onClick={onManageCustomers}
            className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        }
        filterControls={
          <FilterBar
            inline
            search={{
              value: searchQuery,
              onChange: setSearchQuery,
              placeholder: 'Search customers...',
            }}
            filters={[
              {
                id: 'segment',
                label: 'Customer Segment',
                value: segmentFilter,
                onChange: setSegmentFilter,
                placeholder: 'All Segments',
                options: [
                  { label: 'All Segments', value: 'all' },
                  { label: 'Premium Members', value: 'premium' },
                  { label: 'Regular Members', value: 'regular' },
                  { label: 'Trial Members', value: 'trial' },
                ],
              },
            ]}
            showFilters={showFilters}
            onToggleFilters={setShowFilters}
          />
        }
      >
        {/* Filter Panel */}
        {showFilters && (
          <FilterBar
            filters={[
              {
                id: 'segment',
                label: 'Customer Segment',
                value: segmentFilter,
                onChange: setSegmentFilter,
                placeholder: 'All Segments',
                options: [
                  { label: 'All Segments', value: 'all' },
                  { label: 'Premium Members', value: 'premium' },
                  { label: 'Regular Members', value: 'regular' },
                  { label: 'Trial Members', value: 'trial' },
                ],
              },
            ]}
            showFilters={true}
            showToggle={false}
          />
        )}
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold">{totalCustomers}</p>
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
                <p className="text-sm text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold">{activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Spending</p>
                <p className="text-2xl font-bold">${Math.round(avgSpending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Directory
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search customers..." 
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <img 
                    src={customer.avatar} 
                    alt={customer.name}
                    className="w-12 h-12 rounded-full"
                  />

                  {/* Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{customer.name}</h3>
                      {customer.status === 'vip' && (
                        <Badge className="bg-[#FC8936]">
                          <Star className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                      {customer.status === 'active' && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {customer.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Total Spent</p>
                      <p className="font-semibold">${customer.totalSpent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Visits</p>
                      <p className="font-semibold">{customer.visits}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {customers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No customers yet</p>
              <p className="text-sm text-gray-400">Customers will appear here once they join your activities</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Customer Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">Most Active Customer</p>
              <p className="font-semibold">{customers[0]?.name || 'N/A'}</p>
              <p className="text-xs text-gray-400 mt-1">{customers[0]?.visits || 0} visits</p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">Highest Spender</p>
              <p className="font-semibold">{customers.sort((a, b) => b.totalSpent - a.totalSpent)[0]?.name || 'N/A'}</p>
              <p className="text-xs text-gray-400 mt-1">${customers[0]?.totalSpent || 0} total</p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">Retention Rate</p>
              <p className="font-semibold">85%</p>
              <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}