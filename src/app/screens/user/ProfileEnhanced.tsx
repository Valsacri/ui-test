import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Progress } from '@/app/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { MemojiFace } from '@/app/components/MemojiFace';
import { MemojiFaceAvatar } from '@/app/components/MemojiFaceAvatar';
import { ProgressChart } from '@/app/components/ProgressChart';
import { GoalCard } from '@/app/components/GoalCard';
import { SportBadge } from '@/app/components/SportBadge';
import { RecommendationActivityCard } from '@/app/components/RecommendationActivityCard';
import { TicketModal } from '@/app/components/TicketModal';
import { 
  Edit, 
  MapPin, 
  Calendar, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  Users,
  Clock,
  Share2,
  Settings,
  Bell,
  Heart,
  MessageSquare,
  Flame,
  Camera,
  Activity,
  Plus,
  CheckCircle2,
  Sparkles,
  Ruler,
  Weight
} from 'lucide-react';
import { toast } from 'sonner';
import { RECOMMENDED_ACTIVITIES, MOCK_GOALS, MOCK_PROGRESS_DATA, MOCK_PERSONAL_PROFILE, SPORTS } from '@/app/data/mockData';

interface ProfileEnhancedProps {
  onNotifications: () => void;
  onMessages: () => void;
  onGoals: () => void;
  onSwitchProfile: (type: 'user' | 'business') => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  date: string;
  color: string;
}

interface ActivityHistory {
  id: string;
  title: string;
  sport: string;
  date: string;
  status: 'completed' | 'upcoming';
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Joined 10 morning activities',
    icon: Trophy,
    date: '2025-01-15',
    color: 'text-yellow-600'
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Connected with 50+ people',
    icon: Users,
    date: '2025-01-20',
    color: 'text-pink-600'
  },
  {
    id: '3',
    title: 'Fitness Streak',
    description: '30-day activity streak',
    icon: Target,
    date: '2025-02-01',
    color: 'text-green-600'
  },
  {
    id: '4',
    title: 'Multi-Sport Athlete',
    description: 'Tried 5 different sports',
    icon: Award,
    date: '2025-01-25',
    color: 'text-blue-600'
  }
];

const ACTIVITY_HISTORY: ActivityHistory[] = [
  {
    id: '1',
    title: 'Morning Yoga Flow',
    sport: 'Yoga',
    date: 'Feb 2, 2026',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Basketball Pickup Game',
    sport: 'Basketball',
    date: 'Jan 30, 2026',
    status: 'completed'
  },
  {
    id: '3',
    title: 'HIIT Training Session',
    sport: 'Fitness',
    date: 'Jan 28, 2026',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Weekend Soccer Match',
    sport: 'Soccer',
    date: 'Jan 27, 2026',
    status: 'completed'
  }
];

export function ProfileEnhanced({
  onNotifications,
  onMessages,
  onGoals,
  onSwitchProfile
}: ProfileEnhancedProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');
  const [joinedActivityIds, setJoinedActivityIds] = useState<string[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const handleJoinActivity = (activityId: string) => {
    setJoinedActivityIds(prev => [...prev, activityId]);
    const activity = RECOMMENDED_ACTIVITIES.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      setShowTicketModal(true);
      toast.success(`Joined ${activity.title}!`, {
        description: 'Your QR code ticket has been generated.'
      });
    }
  };

  const userData = {
    name: 'Alex Johnson',
    username: '@alexjohnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'Jan 2025',
    avatar: '',
    location: 'New York, NY',
    memberSince: 'January 2025',
    bio: 'Fitness enthusiast | Weekend warrior | Always up for a challenge 💪',
    stats: {
      activitiesJoined: 127,
      goalsCompleted: 15,
      connections: 234
    },
    favoriteSports: ['Basketball', 'Yoga', 'Running'],
    level: 'Intermediate'
  };
  
  // Calculate goals data for TopBar
  const activeGoalsCount = MOCK_GOALS.length;
  const overallProgress = Math.round(
    MOCK_GOALS.reduce((acc, goal) => acc + goal.progress, 0) / MOCK_GOALS.length
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="bg-primary text-white text-3xl">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
                    <p className="text-muted-foreground mb-2">{userData.username}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userData.location}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {userData.joinDate}</span>
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
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm mb-4 leading-relaxed">{userData.bio}</p>

                {/* Level & Sports */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-[#003C66] to-[#005A99] text-white border-0 px-3 py-1">
                    <Activity className="w-3 h-3 mr-1.5" />
                    {userData.level}
                  </Badge>
                  <div className="h-4 w-px bg-gray-300"></div>
                  {userData.favoriteSports.map(sportName => (
                    <Badge 
                      key={sportName} 
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {sportName}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{userData.stats.activitiesJoined}</p>
                    <p className="text-xs text-muted-foreground">Activities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{userData.stats.goalsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Goals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{userData.stats.connections}</p>
                    <p className="text-xs text-muted-foreground">Connections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Personal Informations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Recent Achievements */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-secondary" />
                    Recent Achievements
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ACHIEVEMENTS.slice(0, 4).map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={achievement.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <Icon className={`w-8 h-8 mb-2 ${achievement.color}`} />
                          <p className="font-semibold text-sm mb-1">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    This Month's Progress
                  </h3>
                  <ProgressChart data={MOCK_PROGRESS_DATA} />
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {ACTIVITY_HISTORY.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between border-l-4 border-[#FC8936] pl-3 py-2">
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.sport} • {activity.date}</p>
                        </div>
                        <Badge variant={activity.status === 'completed' ? 'secondary' : 'default'}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {ACTIVITY_HISTORY.map((activity) => (
                      <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.sport}</p>
                          </div>
                          <Badge variant={activity.status === 'completed' ? 'secondary' : 'default'}>
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-4">
              {/* Header with New Goal Button */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Your Goals</h2>
                  <p className="text-sm text-muted-foreground">Track your progress and achievements</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" />
                  New Goal
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-gradient-to-br from-blue-600 to-green-600 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <Target className="w-5 h-5 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{MOCK_GOALS.length}</p>
                    <p className="text-xs text-blue-100">Active Goals</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-600 to-green-600 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <CheckCircle2 className="w-5 h-5 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {MOCK_GOALS.reduce((acc, goal) => acc + goal.milestones.filter(m => m.completed).length, 0)}
                    </p>
                    <p className="text-xs text-blue-100">Completed</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-600 to-green-600 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-5 h-5 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{overallProgress}%</p>
                    <p className="text-xs text-blue-100">Overall</p>
                  </CardContent>
                </Card>
              </div>

              {/* Weight Progress Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Weight Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* User Profile Section */}
                  <div className="flex items-start gap-6 mb-6 pb-6 border-b">
                    {/* Standing Avatar */}
                    <div className="flex-shrink-0">
                      <MemojiFaceAvatar
                        skinTone={MOCK_PERSONAL_PROFILE.avatarCustomization?.skinTone || '#F4C2A0'}
                        hairColor={MOCK_PERSONAL_PROFILE.avatarCustomization?.hairColor || '#4A3728'}
                        size="lg"
                      />
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{userData.name}</h3>
                        <p className="text-sm text-muted-foreground">{userData.level} • {userData.location}</p>
                      </div>

                      {/* Height & Weight Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Ruler className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Height</span>
                          </div>
                          <p className="text-lg font-semibold">{MOCK_PERSONAL_PROFILE.height || '5\'10"'}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Weight className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Current Weight</span>
                          </div>
                          <p className="text-lg font-semibold">{MOCK_PERSONAL_PROFILE.currentWeight || '185 lbs'}</p>
                        </div>
                      </div>

                      {/* Goal Weight */}
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-secondary" />
                        <span className="text-muted-foreground">Goal:</span>
                        <span className="font-semibold">{MOCK_PERSONAL_PROFILE.targetWeight || '175 lbs'}</span>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  {/* Progress Chart */}
                  <ProgressChart
                    data={MOCK_PROGRESS_DATA}
                    unit=" lbs"
                    color="#3b82f6"
                  />
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">
                      <strong>Great progress!</strong> You've completed 45% of your weight loss goal. 
                      Keep up the cardio sessions.
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-semibold mb-3">Recommended Activities:</p>
                    <div className="space-y-2">
                      {RECOMMENDED_ACTIVITIES.map((activity) => (
                        <RecommendationActivityCard
                          key={activity.id}
                          {...activity}
                          onJoin={handleJoinActivity}
                          isJoined={joinedActivityIds.includes(activity.id)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goals List */}
              <div className="space-y-3">
                {MOCK_GOALS.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    {...goal}
                    onClick={() => console.log('Goal clicked:', goal.id)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-gray-100`}>
                            <Icon className={`w-8 h-8 ${achievement.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Earned on {achievement.date}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input value={userData.name} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input value={userData.username} readOnly />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" value={userData.email} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input type="tel" value={userData.phone} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input value={userData.location} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Input value={userData.bio} readOnly />
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

      {/* Ticket Modal */}
      {selectedActivity && (
        <TicketModal
          isOpen={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          activityId={selectedActivity.id}
          userId="user-123"
          activityTitle={selectedActivity.title}
          activityDate={selectedActivity.date ? new Date(selectedActivity.date) : undefined}
          activityTime={selectedActivity.time}
          location={selectedActivity.location}
          userName={userData.name}
        />
      )}
    </div>
  );
}