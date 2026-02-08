import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ActivityCard } from '@/app/components/ActivityCard';
import { FormationBuilder } from '@/app/components/squad/FormationBuilder';
import { JerseyDesigner3D } from '@/app/components/squad/JerseyDesigner3D';
import { 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Target,
  Plus,
  Crown,
  Award,
  Flame,
  MapPin,
  Clock,
  Shirt,
  Layers,
  UserPlus,
  Mail
} from 'lucide-react';
import { MOCK_SQUAD_PROFILES } from '@/app/data/mockData';

interface SquadDashboardProps {
  currentSquadId?: string;
  onCreateActivity?: () => void;
  onManageMembers?: () => void;
}

export function SquadDashboard({ 
  currentSquadId = 'squad-1', 
  onCreateActivity,
  onManageMembers 
}: SquadDashboardProps) {
  const squad = MOCK_SQUAD_PROFILES.find(s => s.id === currentSquadId) || MOCK_SQUAD_PROFILES[0];
  
  const stats = [
    { label: 'Total Members', value: squad.memberCount || 12, icon: Users, color: 'text-[#FC8936]', bgColor: 'bg-orange-50' },
    { label: 'Activities This Month', value: '18', icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Squad Achievements', value: '8', icon: Trophy, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'Win Rate', value: '73%', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
  ];

  const upcomingActivities = [
    { 
      id: '1', 
      title: 'Weekly Squad Training',
      sport: squad.sport || 'Basketball',
      date: 'Feb 8, 2026',
      time: '6:00 PM',
      location: 'Central Sports Complex',
      participants: 8,
      maxParticipants: 12,
      level: 'Intermediate' as const
    },
    { 
      id: '2', 
      title: 'Friendly Match vs Thunder Squad',
      sport: squad.sport || 'Basketball',
      date: 'Feb 10, 2026',
      time: '4:00 PM',
      location: 'Stadium Arena',
      participants: 12,
      maxParticipants: 12,
      level: 'Advanced' as const
    },
    { 
      id: '3', 
      title: 'Team Building Session',
      sport: squad.sport || 'Basketball',
      date: 'Feb 12, 2026',
      time: '5:30 PM',
      location: 'Fitness Center',
      participants: 5,
      maxParticipants: 15,
      level: 'Beginner' as const
    },
  ];

  const recentAchievements = [
    { id: '1', title: '100 Workouts Completed', date: 'Feb 5, 2026', icon: Award },
    { id: '2', title: 'Regional Championship Win', date: 'Feb 1, 2026', icon: Trophy },
    { id: '3', title: '10-Game Win Streak', date: 'Jan 28, 2026', icon: Flame },
  ];

  const topMembers = [
    { id: '1', name: 'Sarah Chen', avatar: '', role: 'Captain', points: 850 },
    { id: '2', name: 'Marcus Reid', avatar: '', role: 'Co-Captain', points: 720 },
    { id: '3', name: 'Emma Davis', avatar: '', role: 'Member', points: 680 },
    { id: '4', name: 'James Wilson', avatar: '', role: 'Member', points: 650 },
  ];

  const allMembers = [
    { id: '1', name: 'Sarah Chen', avatar: '', role: 'Captain', position: 'Forward', number: 10, status: 'Active' },
    { id: '2', name: 'Marcus Reid', avatar: '', role: 'Co-Captain', position: 'Midfielder', number: 8, status: 'Active' },
    { id: '3', name: 'Emma Davis', avatar: '', role: 'Member', position: 'Defender', number: 5, status: 'Active' },
    { id: '4', name: 'James Wilson', avatar: '', role: 'Member', position: 'Forward', number: 9, status: 'Active' },
    { id: '5', name: 'Olivia Taylor', avatar: '', role: 'Member', position: 'Goalkeeper', number: 1, status: 'Active' },
    { id: '6', name: 'Liam Brown', avatar: '', role: 'Member', position: 'Midfielder', number: 6, status: 'Active' },
    { id: '7', name: 'Sophia Martinez', avatar: '', role: 'Member', position: 'Defender', number: 4, status: 'Active' },
    { id: '8', name: 'Noah Anderson', avatar: '', role: 'Member', position: 'Forward', number: 11, status: 'Active' },
    { id: '9', name: 'Ava Garcia', avatar: '', role: 'Member', position: 'Midfielder', number: 7, status: 'Injured' },
    { id: '10', name: 'Ethan Lee', avatar: '', role: 'Member', position: 'Defender', number: 3, status: 'Active' },
    { id: '11', name: 'Isabella White', avatar: '', role: 'Member', position: 'Midfielder', number: 14, status: 'Active' },
    { id: '12', name: 'Mason Harris', avatar: '', role: 'Member', position: 'Defender', number: 2, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section with Squad Banner */}
      <Card className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#FC8936] via-[#E67A2E] to-[#FC8936] flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{squad.name}</h1>
            <p className="text-lg opacity-90">{squad.sport}</p>
            <Badge className="mt-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {squad.memberCount} Active Members
            </Badge>
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">
            <Layers className="w-4 h-4 mr-2" />
            Formation
          </TabsTrigger>
          <TabsTrigger value="jersey">
            <Shirt className="w-4 h-4 mr-2" />
            Jersey Design
          </TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Activities */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FC8936]" />
                  Upcoming Activities
                </h2>
                <Button 
                  onClick={onCreateActivity}
                  size="sm" 
                  className="bg-[#FC8936] hover:bg-[#E67A2E]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
              <div className="space-y-3">
                {upcomingActivities.map((activity) => (
                  <ActivityCard 
                    key={activity.id}
                    id={activity.id}
                    title={activity.title}
                    sport={activity.sport}
                    date={activity.date}
                    time={activity.time}
                    location={activity.location}
                    participants={activity.participants}
                    maxParticipants={activity.maxParticipants}
                    level={activity.level}
                  />
                ))}
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FC8936]" />
                Recent Achievements
              </h2>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-transparent rounded-xl border border-yellow-100"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <achievement.icon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Top Members Leaderboard */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FC8936]" />
                Top Contributors
              </h2>
              <Button 
                onClick={onManageMembers}
                variant="outline" 
                size="sm"
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-[#FC8936]">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#FC8936]">{member.points}</p>
                    <p className="text-xs text-gray-600">points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Formation Tab */}
        <TabsContent value="members" className="space-y-6">
          {/* Formation Builder */}
          <FormationBuilder 
            sport={squad.sport || 'Football'}
            onSave={(formation) => console.log('Formation saved:', formation)}
          />

          {/* Squad Roster */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FC8936]" />
                Squad Roster
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Invite Members
                </Button>
                <Button size="sm" className="bg-[#FC8936] hover:bg-[#E67A2E]">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allMembers.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <Avatar className="h-14 w-14 border-2 border-[#FC8936]">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white font-bold">
                      {member.number}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.position}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={member.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {member.status}
                      </Badge>
                      <span className="text-xs text-gray-500">#{member.number}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Jersey Design Tab */}
        <TabsContent value="jersey">
          <JerseyDesigner3D 
            onSave={(design) => console.log('Jersey design saved:', design)}
          />
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card className="p-6">
            <p className="text-gray-600">Activities management coming soon...</p>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card className="p-6">
            <p className="text-gray-600">Achievements overview coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}