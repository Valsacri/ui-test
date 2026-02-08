import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { OrganizerPortfolio } from '@/app/components/OrganizerPortfolio';
import { 
  MOCK_PERSONAL_PROFILE,
  MOCK_BUSINESS_PROFILES
} from '@/app/data/mockData';
import { 
  Edit,
  Camera,
  MapPin,
  Calendar,
  Trophy,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Building2,
  Package,
  Wrench,
  Settings,
  Share2,
  Mail,
  Phone,
  Globe,
  Clock,
  Award,
  BarChart3,
  Briefcase,
  Eye
} from 'lucide-react';

interface BusinessProfileProps {
  onNotifications: () => void;
  onMessages: () => void;
  onSwitchProfile: (type: 'user' | 'business', profileId?: string) => void;
  currentBusinessId?: string;
}

export function BusinessProfile({ 
  onNotifications, 
  onMessages,
  onSwitchProfile,
  currentBusinessId = 'business-1'
}: BusinessProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'portfolio' | 'resources' | 'settings'>('overview');
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  // Get current business profile
  const currentBusiness = MOCK_BUSINESS_PROFILES.find(b => b.id === currentBusinessId) || MOCK_BUSINESS_PROFILES[0];

  // Mock business data
  const businessData = {
    name: currentBusiness.name,
    tagline: 'Your journey to peak fitness starts here',
    type: currentBusiness.type || 'Fitness Center',
    email: 'contact@peakperformance.com',
    phone: '+1 (555) 987-6543',
    website: 'www.peakperformance.com',
    location: '123 Fitness Ave, New York, NY 10001',
    foundedDate: 'March 2020',
    bio: 'Premier fitness facility offering state-of-the-art equipment, expert trainers, and diverse group classes. We specialize in personalized training programs, strength training, cardio fitness, and wellness coaching.',
    avatar: currentBusiness.avatar,
    coverImage: 'modern gym interior',
    rating: 4.8,
    reviewCount: 342,
    stats: {
      totalRevenue: 2450,
      activeEvents: 8,
      totalCustomers: 245,
      avgRating: 4.8,
      sponsorshipDeals: 3,
      monthlyGrowth: 23
    },
    facilities: 5,
    products: 12,
    services: 8,
    certifications: ['Certified Fitness Facility', 'Licensed Trainers', 'Safety Compliant'],
    operatingHours: 'Mon-Fri: 6AM-10PM | Sat-Sun: 8AM-8PM'
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const recentActivities = [
    { id: 1, title: 'HIIT Bootcamp', participants: 15, revenue: 300, date: 'Feb 1, 2026' },
    { id: 2, title: 'Yoga Flow', participants: 20, revenue: 400, date: 'Jan 30, 2026' },
    { id: 3, title: 'Strength Training', participants: 12, revenue: 240, date: 'Jan 28, 2026' }
  ];

  return (
    <div className="pb-20">
      {/* Cover Image - Full Width */}
      <div className="relative h-48 bg-gradient-to-r from-[#003C66] to-[#005A99] -mx-4">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-4xl mx-auto h-full relative px-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50"
          >
            <Camera className="w-4 h-4 mr-2" />
            Change Cover
          </Button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="px-4 pb-6">
          <div className="bg-white rounded-lg p-6 -mt-16 relative z-10 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={businessData.avatar} />
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {getInitials(businessData.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 bg-secondary hover:bg-[#E67A2E]"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{businessData.name}</h1>
                      <Badge className="bg-secondary">
                        <Award className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{businessData.tagline}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="secondary">{businessData.type}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{businessData.rating}</span>
                        <span className="text-muted-foreground">({businessData.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm mb-4 leading-relaxed">{businessData.bio}</p>

                {/* Certifications */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {businessData.certifications.map(cert => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{businessData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{businessData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{businessData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>{businessData.website}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">${businessData.stats.totalRevenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{businessData.stats.activeEvents}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{businessData.stats.totalCustomers}</p>
                    <p className="text-xs text-muted-foreground">Customers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">+{businessData.stats.monthlyGrowth}%</p>
                    <p className="text-xs text-muted-foreground">Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="portfolio">
                <Briefcase className="w-4 h-4 mr-1" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{businessData.facilities}</p>
                        <p className="text-sm text-muted-foreground">Facilities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Package className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{businessData.products}</p>
                        <p className="text-sm text-muted-foreground">Products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Wrench className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{businessData.services}</p>
                        <p className="text-sm text-muted-foreground">Services</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Events */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-secondary" />
                    Recent Events
                  </h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{activity.title}</h4>
                          <Badge variant="secondary">${activity.revenue}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{activity.participants} participants</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{activity.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Operating Hours
                  </h3>
                  <p className="text-sm text-muted-foreground">{businessData.operatingHours}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              {/* Revenue Chart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Revenue Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">${businessData.stats.totalRevenue}</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">+{businessData.stats.monthlyGrowth}%</p>
                        <p className="text-sm text-muted-foreground">Growth Rate</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Event Revenue</span>
                          <span className="font-semibold">85%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Product Sales</span>
                          <span className="font-semibold">65%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: '65%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Sponsorship Deals</span>
                          <span className="font-semibold">45%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: '45%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Metrics */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Customer Insights
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-1">Total Customers</p>
                      <p className="text-2xl font-bold">{businessData.stats.totalCustomers}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-1">Avg. Rating</p>
                      <div className="flex items-center gap-1">
                        <p className="text-2xl font-bold">{businessData.stats.avgRating}</p>
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-1">Active Subscribers</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-1">Retention Rate</p>
                      <p className="text-2xl font-bold text-green-600">92%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">Organizer Portfolio</h3>
                      <p className="text-sm text-muted-foreground">Showcase your track record to potential sponsors</p>
                    </div>
                    <Button
                      onClick={() => setShowPortfolioModal(true)}
                      className="bg-secondary hover:bg-[#e07830]"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      View Full Portfolio
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 text-blue-600 text-sm mb-2">
                        <Trophy className="w-4 h-4" />
                        <span>Total Events</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">2</p>
                      <p className="text-xs text-muted-foreground mt-1">Past events organized</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                        <Users className="w-4 h-4" />
                        <span>Total Attendance</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">4.3K</p>
                      <p className="text-xs text-muted-foreground mt-1">Across all events</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-purple-50">
                      <div className="flex items-center gap-2 text-purple-600 text-sm mb-2">
                        <Eye className="w-4 h-4" />
                        <span>Media Reach</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">235K</p>
                      <p className="text-xs text-muted-foreground mt-1">Impressions generated</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center gap-2 text-orange-600 text-sm mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Avg Engagement</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-900">13.9%</p>
                      <p className="text-xs text-muted-foreground mt-1">Engagement rate</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">For Sponsors Only</h4>
                        <p className="text-sm text-muted-foreground">
                          Your complete portfolio with event proof, metrics, and testimonials is shared with potential sponsors as part of your sponsorship deck.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Resource Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-semibold">Facilities</p>
                          <p className="text-sm text-muted-foreground">{businessData.facilities} active spaces</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold">Products</p>
                          <p className="text-sm text-muted-foreground">{businessData.products} items listed</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wrench className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="font-semibold">Services</p>
                          <p className="text-sm text-muted-foreground">{businessData.services} services offered</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-4">Business Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Business Name</Label>
                        <Input value={businessData.name} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input value={businessData.tagline} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Business Type</Label>
                        <Input value={businessData.type} readOnly />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={businessData.email} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input type="tel" value={businessData.phone} readOnly />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input value={businessData.website} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input value={businessData.location} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={businessData.bio} rows={4} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Operating Hours</Label>
                        <Input value={businessData.operatingHours} readOnly />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Bookings</p>
                          <p className="text-sm text-muted-foreground">Get notified about new activity bookings</p>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Payment Alerts</p>
                          <p className="text-sm text-muted-foreground">Receive payment and revenue notifications</p>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <OrganizerPortfolio onClose={() => setShowPortfolioModal(false)} />
      )}
    </div>
  );
}