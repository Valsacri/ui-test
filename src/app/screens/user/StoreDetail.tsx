import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { TopBar } from '@/app/components/TopBar';
import { 
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Heart,
  Share2,
  Award,
  Building2,
  Package,
  Wrench,
  Calendar,
  Clock
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { 
  MOCK_BUSINESS_FACILITIES,
  MOCK_BUSINESS_PRODUCTS,
  MOCK_BUSINESS_SERVICES,
  MOCK_ACTIVITIES
} from '@/app/data/mockData';

/**
 * StoreDetail - Public Business Profile View
 * 
 * This component displays a business profile as seen by regular users
 * (not the business owner). It dynamically shows:
 * - Public business information
 * - Facilities (gyms, courts, studios)
 * - Products (gear, supplements, merchandise)
 * - Services (training, consultations, classes)
 * - Activities (events, sessions they're hosting)
 * - Contact details
 * - Follow/interaction buttons
 * 
 * For business owner management view, see BusinessDashboard.tsx
 */

interface StoreDetailProps {
  storeId: string;
  onBack: () => void;
  onProductDetail: (productId: string) => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
}

const STORE_DATA: { [key: string]: any } = {
  decathlon: {
    id: 'decathlon',
    name: 'Decathlon',
    logo: '🏃',
    tagline: 'Sports for All',
    description: 'Decathlon is your one-stop shop for all sporting goods. From beginners to professionals, we have equipment for over 80 sports at unbeatable prices.',
    rating: 4.6,
    reviewCount: 2453,
    followers: 15600,
    coverImage: 'decathlon sports store',
    address: '123 Sports Ave, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'contact@decathlon.com',
    website: 'www.decathlon.com',
    badges: ['Official Retailer', 'Fast Shipping', 'Easy Returns'],
    offerings: {
      facilities: false,
      products: true,
      services: false,
      activities: false
    }
  },
  'business-1': {
    id: 'business-1',
    name: 'Peak Performance Gym',
    logo: '💪',
    tagline: 'Your journey to peak fitness starts here',
    description: 'Premier fitness facility offering state-of-the-art equipment, expert trainers, and diverse group classes. We specialize in personalized training programs, strength training, cardio fitness, and wellness coaching.',
    rating: 4.8,
    reviewCount: 342,
    followers: 2400,
    coverImage: 'modern gym interior',
    address: '123 Fitness Ave, New York, NY 10001',
    phone: '+1 (555) 987-6543',
    email: 'contact@peakperformance.com',
    website: 'www.peakperformance.com',
    badges: ['Certified Facility', 'Licensed Trainers', 'Award Winning'],
    offerings: {
      facilities: true,
      products: true,
      services: true,
      activities: true
    }
  },
  'business-2': {
    id: 'business-2',
    name: 'Urban Yoga Studio',
    logo: '🧘',
    tagline: 'Find Your Inner Peace',
    description: 'A tranquil space for yoga, meditation, and mindfulness. We offer classes for all levels from beginners to advanced practitioners.',
    rating: 4.9,
    reviewCount: 187,
    followers: 1850,
    coverImage: 'yoga studio peaceful',
    address: '456 Zen Way, Brooklyn, NY 11201',
    phone: '+1 (555) 876-5432',
    email: 'hello@urbanyoga.com',
    website: 'www.urbanyoga.com',
    badges: ['RYT Certified', 'Eco-Friendly', 'Community Focused'],
    offerings: {
      facilities: true,
      products: false,
      services: true,
      activities: true
    }
  }
};

export function StoreDetail({ 
  storeId,
  onBack, 
  onProductDetail,
  onNotifications, 
  onMessages, 
  onProfile 
}: StoreDetailProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  
  const store = STORE_DATA[storeId] || STORE_DATA['business-1'];
  
  // Determine which tabs to show based on what the business offers
  const availableTabs: string[] = [];
  if (store.offerings.activities) availableTabs.push('activities');
  if (store.offerings.facilities) availableTabs.push('facilities');
  if (store.offerings.services) availableTabs.push('services');
  if (store.offerings.products) availableTabs.push('products');
  
  const [activeTab, setActiveTab] = useState(availableTabs[0] || 'activities');

  // Filter data by business (in real app, this would come from API)
  const businessActivities = MOCK_ACTIVITIES.filter(a => a.type === 'activity').slice(0, 4);
  const businessFacilities = MOCK_BUSINESS_FACILITIES;
  const businessProducts = MOCK_BUSINESS_PRODUCTS;
  const businessServices = MOCK_BUSINESS_SERVICES;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar
        onNotifications={onNotifications}
        onMessages={onMessages}
        onProfile={onProfile}
        notificationCount={3}
        messageCount={2}
        showSearch={false}
      />

      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-[#003C66] to-[#005A99]">
          <ImageWithFallback
            src={`https://source.unsplash.com/800x400/?${store.coverImage}`}
            alt={store.name}
            className="w-full h-full object-cover opacity-50"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 bg-black/30 text-white hover:bg-black/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/30 text-white hover:bg-black/50"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Store Info */}
        <div className="px-4 pb-6">
          <div className="bg-white rounded-lg p-6 -mt-16 relative z-10 shadow-lg mb-6">
            {/* Logo & Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-4xl shadow-lg">
                {store.logo}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{store.name}</h1>
                <p className="text-muted-foreground mb-2">{store.tagline}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{store.rating}</span>
                    <span className="text-muted-foreground">({store.reviewCount} reviews)</span>
                  </div>
                  <div className="text-muted-foreground">
                    {store.followers.toLocaleString()} followers
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {store.badges.map((badge: string) => (
                <Badge key={badge} variant="secondary" className="bg-blue-50 text-blue-700">
                  <Award className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={() => setIsFollowing(!isFollowing)}
                className={isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-primary hover:bg-primary/90'}
              >
                {isFollowing ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Following
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {store.description}
            </p>

            {/* Contact Info */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{store.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{store.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <a href={`https://${store.website}`} className="text-primary hover:underline">
                  {store.website}
                </a>
              </div>
            </div>
          </div>

          {/* Offerings Section */}
          {availableTabs.length > 0 && (
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={`grid w-full mb-4`} style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
                  {store.offerings.activities && <TabsTrigger value="activities">Activities</TabsTrigger>}
                  {store.offerings.facilities && <TabsTrigger value="facilities">Facilities</TabsTrigger>}
                  {store.offerings.services && <TabsTrigger value="services">Services</TabsTrigger>}
                  {store.offerings.products && <TabsTrigger value="products">Products</TabsTrigger>}
                </TabsList>

                {/* Activities Tab */}
                {store.offerings.activities && (
                  <TabsContent value="activities" className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <h2 className="font-bold text-lg">Upcoming Activities</h2>
                    </div>
                    <div className="space-y-3">
                      {businessActivities.map((activity) => (
                        <Card key={activity.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={activity.image}
                                  alt={activity.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{activity.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{activity.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{activity.time}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary">{activity.sport}</Badge>
                                  <span className="font-semibold text-primary">
                                    ${activity.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {/* Facilities Tab */}
                {store.offerings.facilities && (
                  <TabsContent value="facilities" className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-secondary" />
                      <h2 className="font-bold text-lg">Available Facilities</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {businessFacilities.map((facility) => (
                        <Card key={facility.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex gap-4 p-4">
                              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={facility.image}
                                  alt={facility.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-2">{facility.name}</h3>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Hourly Rate</span>
                                  <span className="font-bold text-primary">
                                    ${facility.pricePerHour}/hr
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {/* Services Tab */}
                {store.offerings.services && (
                  <TabsContent value="services" className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="w-5 h-5 text-secondary" />
                      <h2 className="font-bold text-lg">Services Offered</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {businessServices.map((service) => (
                        <Card key={service.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex gap-4 p-4">
                              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={service.image}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-2">{service.name}</h3>
                                <div className="flex items-center justify-between">
                                  <Button size="sm" variant="outline">Book Now</Button>
                                  <span className="font-bold text-primary">
                                    ${service.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}

                {/* Products Tab */}
                {store.offerings.products && (
                  <TabsContent value="products" className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5 text-secondary" />
                      <h2 className="font-bold text-lg">Products</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {businessProducts.map((product) => (
                        <Card 
                          key={product.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => onProductDetail(product.id)}
                        >
                          <CardContent className="p-0">
                            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-primary">${product.price}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
