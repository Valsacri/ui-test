import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { TopBar } from '@/app/components/TopBar';
import { BusinessSwitcher, Business } from '@/app/components/BusinessSwitcher';
import { OrganizerPortfolio } from '@/app/components/OrganizerPortfolio';
import { AddResourceModal } from '@/app/components/AddResourceModal';
import { AddTeamMemberModal } from '@/app/components/AddTeamMemberModal';
import { AddCampaignModal } from '@/app/components/AddCampaignModal';
import { EditResourceModal } from '@/app/components/EditResourceModal';
import { CreateJobOfferModal } from '@/app/components/CreateJobOfferModal';
import { AttendanceManagement } from './AttendanceManagement';
import { 
  MOCK_ACTIVITIES, 
  MOCK_BUSINESS_FACILITIES, 
  MOCK_BUSINESS_PRODUCTS,
  MOCK_BUSINESS_SERVICES,
  MOCK_PERSONAL_PROFILE,
  MOCK_BUSINESS_PROFILES,
  MOCK_PAST_EVENTS,
  SPORTS,
  EXPERIENCE_LEVELS,
  ACTIVITY_TYPES
} from '@/app/data/mockData';
import { 
  Plus, Building2, TrendingUp, Users, Calendar,
  DollarSign, Package, Wrench, MapPin, Trophy,
  Target, Eye, BarChart3, UserCog, Camera, Edit,
  Star, Award, Phone, Mail, Globe, Clock, Settings,
  Share2, Briefcase, Dumbbell, ChevronLeft, ChevronRight,
  Heart, MessageCircle, Send, Image as ImageIcon, Video,
  Mountain, Tent, Activity, QrCode
} from 'lucide-react';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

/**
 * BusinessDashboard - Business Owner Management View
 * 
 * This component is shown when a user is logged in as a business owner
 * and is managing their own business. It provides:
 * - Business operations management (activities, resources, customers, staff)
 * - Analytics and performance metrics
 * - Activity creation and management
 * - Team and job offer management
 * - Sponsorship campaign management
 * 
 * For public business profile view (what users see), see StoreDetail.tsx
 */

interface BusinessDashboardProps {
  onCreateActivity: () => void;
  onManageFacilities: () => void;
  onManageCustomers: () => void;
  onManageTeam?: () => void;
  onCreateBusiness?: () => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
  onSwitchProfile?: (profileType: 'user' | 'business', profileId?: string) => void;
  onCreateCampaign?: () => void;
  currentBusinessId?: string;
}

// Custom arrow components for react-slick that filter out slider props
const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
      aria-label="Next"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
};

const CustomPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
      aria-label="Previous"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
};

// Helper function to get icon component
const getActivityIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Target,
    Dumbbell,
    Trophy,
    Activity,
    Calendar,
    Tent,
    Mountain,
    Award,
  };
  return icons[iconName] || Target;
};

export function BusinessDashboard({ 
  onCreateActivity, 
  onManageFacilities, 
  onManageCustomers, 
  onManageTeam, 
  onCreateBusiness, 
  onNotifications, 
  onMessages, 
  onProfile,
  onSwitchProfile,
  onCreateCampaign,
  currentBusinessId = 'business-1'
}: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'feeds' | 'sponsorship'>('overview');
  const [businessSubTab, setBusinessSubTab] = useState<'activities' | 'resources' | 'customers' | 'staff'>('activities');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateJobOffer, setShowCreateJobOffer] = useState(false);
  const [showAttendanceManagement, setShowAttendanceManagement] = useState(false);
  const [selectedActivityForAttendance, setSelectedActivityForAttendance] = useState<any>(null);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [selectedActivityForEdit, setSelectedActivityForEdit] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingResource, setEditingResource] = useState<{
    resource: any;
    type: 'facility' | 'product' | 'service';
  } | null>(null);
  const myActivities = MOCK_ACTIVITIES.filter(a => a.type === 'activity');
  const sponsoredEvents = MOCK_ACTIVITIES.filter(a => a.type === 'event');
  const totalRevenue = 2450;
  const totalParticipants = 45;
  const activeCampaigns = 2;
  const totalReach = 1250;

  // Get current business profile
  const currentBusiness = MOCK_BUSINESS_PROFILES.find(b => b.id === currentBusinessId) || MOCK_BUSINESS_PROFILES[0];

  // Handle image upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };



  // If showing attendance management, render that screen
  if (showAttendanceManagement && selectedActivityForAttendance) {
    return (
      <AttendanceManagement
        activityId={selectedActivityForAttendance.id}
        activityTitle={selectedActivityForAttendance.title}
        activityDate={new Date(selectedActivityForAttendance.date)}
        activityTime={selectedActivityForAttendance.time || '10:00 AM'}
        location={selectedActivityForAttendance.location}
        maxParticipants={selectedActivityForAttendance.maxParticipants}
        onBack={() => {
          setShowAttendanceManagement(false);
          setSelectedActivityForAttendance(null);
        }}
      />
    );
  }

  return (
    <div className="w-full pb-6">
      {/* Business Profile Section - Removed TopBar as it's now in RootLayout */}
      <div className="bg-white border-b rounded-lg mb-6">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-[#003C66] to-[#005A99]">
          <img 
            src="https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=1200"
            alt="Business cover"
            className="w-full h-full object-cover opacity-40"
          />
          <Button 
            variant="ghost" 
            size="sm"
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white"
          >
            <Camera className="w-4 h-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-0">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={currentBusiness.avatar} />
                  <AvatarFallback className="bg-[#003C66] text-white text-3xl">
                    {currentBusiness.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute bottom-0 right-0 bg-white border shadow-sm rounded-full w-10 h-10 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4 pb-3 gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Business Info */}
          <div className="pb-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">Peak Performance Gym</h1>
                <p className="text-muted-foreground mb-2">
                  Premium fitness center offering state-of-the-art facilities and personalized training programs
                </p>
                
                {/* Rating and Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#FC8936] text-[#FC8936]" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-muted-foreground">(127 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>New York, NY</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Mon-Sun 6AM-10PM</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-[#003C66] hover:bg-[#002A4A]">Pro</Badge>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>info@peakgym.com</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>www.peakgym.com</span>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold">${totalRevenue}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold">{myActivities.length}</p>
                <p className="text-xs text-muted-foreground">Events</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-[#FC8936]" />
                <p className="text-lg font-bold">{activeCampaigns}</p>
                <p className="text-xs text-muted-foreground">Campaigns</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Eye className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <p className="text-lg font-bold">{totalReach}</p>
                <p className="text-xs text-muted-foreground">Reach</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'feeds' | 'sponsorship')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feeds">Feeds</TabsTrigger>
            <TabsTrigger value="sponsorship">Sponsorship & Marketing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Business Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                    <p className="text-xl font-bold">2</p>
                    <p className="text-xs text-muted-foreground">Past Events</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-2 text-green-600" />
                    <p className="text-xl font-bold">4.3K</p>
                    <p className="text-xs text-muted-foreground">Total Attendance</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Eye className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                    <p className="text-xl font-bold">235K</p>
                    <p className="text-xs text-muted-foreground">Media Reach</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                    <p className="text-xl font-bold">Peak Performance Gym</p>
                    <p className="text-xs text-muted-foreground">Fitness Center</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                    <p className="text-xl font-bold">New York, NY</p>
                    <p className="text-xs text-muted-foreground">Location</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <p className="font-semibold">Operating Hours</p>
                    </div>
                    
                    {/* Time slots grid */}
                    <div className="overflow-x-auto">
                      {/* Time header */}
                      <div className="flex gap-1 mb-2">
                        <div className="w-20 flex-shrink-0"></div>
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} className="w-8 flex-shrink-0 text-[10px] text-center text-gray-500">
                            {i === 0 ? '12a' : i < 12 ? `${i}a` : i === 12 ? '12p' : `${i-12}p`}
                          </div>
                        ))}
                      </div>
                      
                      {/* Days with time slots */}
                      <div className="space-y-1">
                        {[
                          { day: 'Mon', start: 6, end: 22 },
                          { day: 'Tue', start: 6, end: 22 },
                          { day: 'Wed', start: 6, end: 22 },
                          { day: 'Thu', start: 6, end: 22 },
                          { day: 'Fri', start: 6, end: 22 },
                          { day: 'Sat', start: 8, end: 20 },
                          { day: 'Sun', start: 8, end: 20 },
                        ].map((daySchedule) => (
                          <div key={daySchedule.day} className="flex gap-1 items-center">
                            <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-700">
                              {daySchedule.day}
                            </div>
                            <div className="flex gap-1">
                              {Array.from({ length: 24 }, (_, hour) => {
                                const isOpen = hour >= daySchedule.start && hour < daySchedule.end;
                                return (
                                  <div
                                    key={hour}
                                    className={`w-8 h-8 flex-shrink-0 rounded ${
                                      isOpen
                                        ? 'bg-[#003C66] hover:bg-[#002A4A]'
                                        : 'bg-gray-200'
                                    } transition-colors`}
                                    title={`${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour}${hour < 12 ? 'AM' : 'PM'} - ${isOpen ? 'Open' : 'Closed'}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-[#003C66] rounded"></div>
                          <span className="text-gray-600">Open</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <span className="text-gray-600">Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feeds Tab */}
          <TabsContent value="feeds" className="space-y-6 mt-6">
            {/* Create Post Action */}
            <Card className="bg-white border hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentBusiness.avatar} />
                    <AvatarFallback className="bg-[#003C66] text-white">
                      {currentBusiness.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 transition-colors">
                    <p className="text-sm text-muted-foreground">Share an update with your followers...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Event
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feed Posts */}
            <div className="space-y-4">
              {/* Activity Announcement Post */}
              <Card>
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-4 flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentBusiness.avatar} />
                      <AvatarFallback className="bg-[#003C66] text-white">
                        {currentBusiness.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">Peak Performance Gym</h3>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">Activity</Badge>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-sm mb-3">
                      🏃‍♂️ Join us for our Morning Yoga Session this Saturday! Perfect for all skill levels. Limited spots available.
                    </p>
                  </div>

                  {/* Post Image */}
                  <div className="relative w-full aspect-video bg-gray-200">
                    <img 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"
                      alt="Yoga session"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <p className="text-xs text-muted-foreground mb-1">Morning Yoga Session</p>
                      <p className="font-semibold text-sm">Sat, Feb 8 • 8:00 AM</p>
                      <p className="text-xs text-muted-foreground">$15 per person</p>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="p-3 border-t flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="text-sm">24</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">8</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Product Showcase Post */}
              <Card>
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-4 flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentBusiness.avatar} />
                      <AvatarFallback className="bg-[#003C66] text-white">
                        {currentBusiness.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">Peak Performance Gym</h3>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Product</Badge>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-sm mb-3">
                      💪 New arrivals! Check out our premium resistance bands - perfect for home workouts and on-the-go training.
                    </p>
                  </div>

                  {/* Post Image */}
                  <div className="relative w-full aspect-video bg-gray-200">
                    <img 
                      src={MOCK_BUSINESS_PRODUCTS[0].image}
                      alt="Resistance bands"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">Resistance Bands Set</p>
                          <p className="text-lg font-bold text-[#003C66]">$29.99</p>
                        </div>
                        <Badge className="bg-[#FC8936] hover:bg-[#E67A2F] cursor-pointer">Shop Now</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="p-3 border-t flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="text-sm">42</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">12</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Service Promotion Post */}
              <Card>
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-4 flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentBusiness.avatar} />
                      <AvatarFallback className="bg-[#003C66] text-white">
                        {currentBusiness.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">Peak Performance Gym</h3>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">Service</Badge>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-sm mb-3">
                      🎯 Transform your fitness journey with our 1-on-1 Personal Training! Customized programs designed just for you.
                    </p>
                  </div>

                  {/* Post Image */}
                  <div className="relative w-full aspect-video bg-gray-200">
                    <img 
                      src={MOCK_BUSINESS_SERVICES[0].image}
                      alt="Personal training"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-sm">1-on-1 Personal Training</p>
                      <p className="text-lg font-bold text-[#003C66]">$75/session</p>
                      <p className="text-xs text-muted-foreground mt-1">First session free!</p>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="p-3 border-t flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="text-sm">56</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">18</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Facility Highlight Post */}
              <Card>
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-4 flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentBusiness.avatar} />
                      <AvatarFallback className="bg-[#003C66] text-white">
                        {currentBusiness.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">Peak Performance Gym</h3>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">Facility</Badge>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-sm mb-3">
                      ⚽ Our indoor sports court is available for rent! Perfect for basketball, volleyball, or futsal. Book your time slot today!
                    </p>
                  </div>

                  {/* Post Image */}
                  <div className="relative w-full aspect-video bg-gray-200">
                    <img 
                      src={MOCK_BUSINESS_FACILITIES[0].image}
                      alt="Sports court"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <p className="font-semibold text-sm">Indoor Sports Court</p>
                      <p className="text-lg font-bold text-[#003C66]">$50/hour</p>
                      <p className="text-xs text-muted-foreground mt-1">Available 6 AM - 10 PM</p>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="p-3 border-t flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="text-sm">38</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">6</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sponsorship Tab */}
          <TabsContent value="sponsorship" className="space-y-6 mt-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onCreateCampaign}
                className="h-auto py-6 flex-col gap-2 bg-[#FC8936] hover:bg-[#E67A2F]"
              >
                <Target className="w-6 h-6" />
                <span>New Campaign</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-6 flex-col gap-2"
              >
                <BarChart3 className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
            </div>

            {/* Active Campaigns */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Campaigns</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Brand Awareness Q1 2026</h3>
                      <p className="text-sm text-muted-foreground">Running & Cycling Events</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Budget</p>
                      <p className="font-semibold">$5,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Spent</p>
                      <p className="font-semibold">$2,150</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reach</p>
                      <p className="font-semibold">850 people</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Events</p>
                      <p className="font-semibold">2 sponsored</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    View Campaign Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Campaign Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-2xl font-bold">$2.50</p>
                    <p className="text-sm text-muted-foreground">Cost per engagement</p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-sm text-muted-foreground">Audience match</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Brand Awareness</span>
                    <span className="font-semibold text-orange-600">+45%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Engagement Rate</span>
                    <span className="font-semibold text-pink-600">+32%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Portfolio */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Organizer Portfolio
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Showcase your track record to attract sponsors
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowPortfolio(true)}
                    className="bg-[#003C66] hover:bg-[#002A4A]"
                  >
                    View Portfolio
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                    <p className="text-xl font-bold">2</p>
                    <p className="text-xs text-muted-foreground">Past Events</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-2 text-green-600" />
                    <p className="text-xl font-bold">4.3K</p>
                    <p className="text-xs text-muted-foreground">Total Attendance</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Eye className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                    <p className="text-xl font-bold">235K</p>
                    <p className="text-xs text-muted-foreground">Media Reach</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals and other content */}
      {showPortfolio && (
        <OrganizerPortfolio
          onClose={() => setShowPortfolio(false)}
          activities={myActivities}
          facilities={MOCK_BUSINESS_FACILITIES}
          products={MOCK_BUSINESS_PRODUCTS}
          services={MOCK_BUSINESS_SERVICES}
        />
      )}

      {showAddResource && (
        <AddResourceModal
          isOpen={showAddResource}
          onClose={() => setShowAddResource(false)}
        />
      )}

      {showAddMember && (
        <AddTeamMemberModal
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {showAddCampaign && (
        <AddCampaignModal
          isOpen={showAddCampaign}
          onClose={() => setShowAddCampaign(false)}
        />
      )}

      {selectedActivityForEdit && (
        <EditResourceModal
          isOpen={!!selectedActivityForEdit}
          onClose={() => setSelectedActivityForEdit(null)}
          resource={{
            id: selectedActivityForEdit.id,
            name: selectedActivityForEdit.title,
            type: 'Activity',
            price: `$${selectedActivityForEdit.price}`,
            status: 'Active'
          }}
        />
      )}

      {showCreateJobOffer && (
        <CreateJobOfferModal
          isOpen={showCreateJobOffer}
          onClose={() => setShowCreateJobOffer(false)}
        />
      )}

      {showAttendanceManagement && selectedActivityForAttendance && (
        <AttendanceManagement
          activity={selectedActivityForAttendance}
          onBack={() => {
            setShowAttendanceManagement(false);
            setSelectedActivityForAttendance(null);
          }}
        />
      )}
    </div>
  );
}