import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { 
  Search, Filter, Building2, Star, Handshake, 
  Users, TrendingUp, Award, MapPin, Plus, DollarSign 
} from 'lucide-react';

interface BusinessPartnersProps {
  onNavigate: (page: string, data?: any) => void;
}

// Mock data for business partners
const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'SportGear Pro',
    type: 'Sports Equipment',
    avatar: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400',
    verified: true,
    revenue: '$2.5M',
    employees: '50-100',
    location: 'New York, NY',
    description: 'Leading sports equipment manufacturer and distributor',
    categories: ['Equipment', 'Retail', 'B2B'],
    activePartnerships: 12,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'FitNutrition Co.',
    type: 'Nutrition & Supplements',
    avatar: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400',
    verified: true,
    revenue: '$1.8M',
    employees: '20-50',
    location: 'Los Angeles, CA',
    description: 'Premium sports nutrition and supplement brand',
    categories: ['Nutrition', 'Supplements', 'Wellness'],
    activePartnerships: 8,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Urban Fitness Studios',
    type: 'Fitness Center',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    verified: true,
    revenue: '$3.2M',
    employees: '100-200',
    location: 'Miami, FL',
    description: 'Multi-location fitness studio chain with premium facilities',
    categories: ['Fitness', 'Gym', 'Wellness'],
    activePartnerships: 15,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'ActiveWear Collective',
    type: 'Apparel',
    avatar: 'https://images.unsplash.com/photo-1556906781-9cba5505d0f8?w=400',
    verified: false,
    revenue: '$950K',
    employees: '10-20',
    location: 'Austin, TX',
    description: 'Sustainable athletic apparel brand for modern athletes',
    categories: ['Apparel', 'Fashion', 'Sustainable'],
    activePartnerships: 5,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Peak Performance Labs',
    type: 'Sports Science',
    avatar: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400',
    verified: true,
    revenue: '$4.1M',
    employees: '50-100',
    location: 'San Francisco, CA',
    description: 'Sports science and performance optimization technology',
    categories: ['Technology', 'Science', 'Analytics'],
    activePartnerships: 20,
    rating: 4.9,
  },
  {
    id: '6',
    name: 'Outdoor Adventures Inc.',
    type: 'Outdoor Activities',
    avatar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
    verified: true,
    revenue: '$1.5M',
    employees: '20-50',
    location: 'Denver, CO',
    description: 'Outdoor adventure experiences and equipment rental',
    categories: ['Adventure', 'Outdoor', 'Tourism'],
    activePartnerships: 10,
    rating: 4.8,
  },
];

export function BusinessPartners({ onNavigate }: BusinessPartnersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBusinesses = MOCK_BUSINESSES.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || business.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(new Set(MOCK_BUSINESSES.flatMap(b => b.categories)));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Partnerships</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect and collaborate with other businesses to expand your reach
          </p>
        </div>
        <Button 
          onClick={() => onNavigate('business-partners-add-collab')}
          className="bg-[#FC8936] hover:bg-[#E67A2F]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Partnership
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{MOCK_BUSINESSES.length}</p>
            <p className="text-xs text-muted-foreground">Available Businesses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Handshake className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Active Partnerships</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">$15.2K</p>
            <p className="text-xs text-muted-foreground">Partnership Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-[#FC8936]" />
            <p className="text-2xl font-bold">4.8</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search businesses by name, type, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
          
          {/* Category filters */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-[#003C66]" : ""}
            >
              All Categories
            </Button>
            {allCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-[#003C66]" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Profile Header */}
              <div className="p-4 bg-gradient-to-r from-[#003C66] to-[#005A99] text-white">
                <div className="flex items-start gap-3">
                  <Avatar className="w-16 h-16 border-2 border-white rounded-lg">
                    <AvatarImage src={business.avatar} />
                    <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold truncate">{business.name}</h3>
                      {business.verified && (
                        <Award className="w-4 h-4 text-[#FC8936] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-white/80">{business.type}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-white/70">
                      <MapPin className="w-3 h-3" />
                      <span>{business.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 border-b">
                <p className="text-sm text-gray-600 line-clamp-2">{business.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {business.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 grid grid-cols-3 gap-2 border-b">
                <div className="text-center">
                  <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  <p className="text-sm font-bold">{business.revenue}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <div className="text-center">
                  <Users className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-bold">{business.employees}</p>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </div>
                <div className="text-center">
                  <Handshake className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  <p className="text-sm font-bold">{business.activePartnerships}</p>
                  <p className="text-xs text-muted-foreground">Partners</p>
                </div>
              </div>

              {/* Rating */}
              <div className="px-4 py-2 border-b">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(business.rating)
                            ? 'fill-[#FC8936] text-[#FC8936]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">{business.rating}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                <Button 
                  className="w-full bg-[#003C66] hover:bg-[#002A4A]"
                  onClick={() => onNavigate('business-partners-add-collab', { business })}
                >
                  <Handshake className="w-4 h-4 mr-2" />
                  Start Partnership
                </Button>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBusinesses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-lg mb-2">No businesses found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
