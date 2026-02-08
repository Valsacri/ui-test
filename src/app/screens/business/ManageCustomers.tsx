import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { TopBar } from '@/app/components/TopBar';
import { 
  ArrowLeft,
  Users,
  UserCheck,
  Crown,
  Search,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Filter
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';

interface ManageCustomersProps {
  onBack: () => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: 'customer' | 'subscriber' | 'beneficiary';
  status: 'active' | 'inactive';
  joinedDate: string;
  totalSpent: number;
  activitiesAttended: number;
  subscriptionTier?: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    type: 'subscriber',
    status: 'active',
    joinedDate: '2024-01-15',
    totalSpent: 450,
    activitiesAttended: 12,
    subscriptionTier: 'Gold'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1 (555) 234-5678',
    type: 'customer',
    status: 'active',
    joinedDate: '2024-02-20',
    totalSpent: 180,
    activitiesAttended: 5
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.w@email.com',
    phone: '+1 (555) 345-6789',
    type: 'subscriber',
    status: 'active',
    joinedDate: '2023-11-10',
    totalSpent: 890,
    activitiesAttended: 28,
    subscriptionTier: 'Platinum'
  },
  {
    id: '4',
    name: 'James Rodriguez',
    email: 'james.r@email.com',
    phone: '+1 (555) 456-7890',
    type: 'beneficiary',
    status: 'active',
    joinedDate: '2024-01-05',
    totalSpent: 0,
    activitiesAttended: 8
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '+1 (555) 567-8901',
    type: 'customer',
    status: 'inactive',
    joinedDate: '2023-12-01',
    totalSpent: 120,
    activitiesAttended: 3
  }
];

export function ManageCustomers({ 
  onBack, 
  onNotifications, 
  onMessages, 
  onProfile 
}: ManageCustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'customers' | 'subscribers' | 'beneficiaries'>('all');

  const filteredCustomers = MOCK_CUSTOMERS.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'customers') return matchesSearch && customer.type === 'customer';
    if (activeTab === 'subscribers') return matchesSearch && customer.type === 'subscriber';
    if (activeTab === 'beneficiaries') return matchesSearch && customer.type === 'beneficiary';
    
    return matchesSearch;
  });

  const stats = {
    total: MOCK_CUSTOMERS.length,
    customers: MOCK_CUSTOMERS.filter(c => c.type === 'customer').length,
    subscribers: MOCK_CUSTOMERS.filter(c => c.type === 'subscriber').length,
    beneficiaries: MOCK_CUSTOMERS.filter(c => c.type === 'beneficiary').length,
    totalRevenue: MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscriber':
        return <Crown className="w-4 h-4" />;
      case 'beneficiary':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Customer Management"
        onNotifications={onNotifications}
        onMessages={onMessages}
        onProfile={onProfile}
        notificationCount={3}
        messageCount={2}
        showSearch={false}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage customers, subscribers, and beneficiaries
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#003C66]" />
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-[#FC8936]" />
                <p className="text-sm text-muted-foreground">Subscribers</p>
              </div>
              <p className="text-2xl font-bold">{stats.subscribers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Beneficiaries</p>
              </div>
              <p className="text-2xl font-bold">{stats.beneficiaries}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">Revenue</p>
              </div>
              <p className="text-2xl font-bold">${stats.totalRevenue}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="customers">Customers ({stats.customers})</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers ({stats.subscribers})</TabsTrigger>
            <TabsTrigger value="beneficiaries">Beneficiaries ({stats.beneficiaries})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3 mt-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback className="bg-[#003C66] text-white">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{customer.name}</h3>
                            <Badge 
                              variant={customer.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {customer.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getTypeIcon(customer.type)}
                            <span className="capitalize">{customer.type}</span>
                            {customer.subscriptionTier && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {customer.subscriptionTier}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Joined</p>
                          <p className="text-sm font-medium">
                            {new Date(customer.joinedDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Activities</p>
                          <p className="text-sm font-medium">{customer.activitiesAttended}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                          <p className="text-sm font-medium text-[#003C66]">
                            ${customer.totalSpent}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No customers found</p>
                <p className="text-sm mt-1">
                  {searchQuery ? 'Try a different search term' : 'Customers will appear here'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
