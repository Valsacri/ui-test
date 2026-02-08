import { ArrowLeft, Users, Calendar, Trophy, MapPin, Shield, Settings, Share2, UserPlus, Crown, Award, Target, Flame, TrendingUp, Swords, Check, UserPlus2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Card } from '@/app/components/ui/card';
import { MOCK_SQUAD_PROFILES } from '@/app/data/mockData';
import { useState } from 'react';
import { toast } from 'sonner';

interface SquadProfileProps {
  squadId: string;
  onBack: () => void;
}

export function SquadProfile({ squadId, onBack }: SquadProfileProps) {
  // Find the squad from mock data
  const squad = MOCK_SQUAD_PROFILES.find(s => s.id === squadId);

  // State to manage if user is a member (mock data)
  const [isMember, setIsMember] = useState(
    squadId === 'squad-1' || squadId === 'squad-3' // User is member of these squads
  );

  if (!squad) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500">Squad not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  // Mock data for squad details
  const stats = {
    members: squad.memberCount || 24,
    activities: squad.activityCount || 156,
    avgRating: 4.8,
    weeklyGoal: 85,
  };

  const achievements = [
    { icon: Trophy, label: '50 Events', color: 'text-yellow-600' },
    { icon: Flame, label: '30-Day Streak', color: 'text-orange-600' },
    { icon: Target, label: 'Goal Crushers', color: 'text-blue-600' },
    { icon: Award, label: 'Top Squad', color: 'text-purple-600' },
  ];

  const members = [
    { id: '1', name: 'Sarah Mitchell', role: 'Captain', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', joined: '2023-01' },
    { id: '2', name: 'Mike Chen', role: 'Co-Captain', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', joined: '2023-01' },
    { id: '3', name: 'Emily Rodriguez', role: 'Member', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', joined: '2023-02' },
    { id: '4', name: 'James Park', role: 'Member', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', joined: '2023-02' },
    { id: '5', name: 'Lisa Anderson', role: 'Member', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', joined: '2023-03' },
    { id: '6', name: 'David Kim', role: 'Member', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', joined: '2023-03' },
  ];

  const upcomingActivities = [
    { id: '1', title: 'Morning Run', date: 'Feb 6, 2026', time: '6:00 AM', location: 'Central Park' },
    { id: '2', title: 'Speed Training', date: 'Feb 8, 2026', time: '7:00 AM', location: 'Track Field' },
    { id: '3', title: 'Long Distance Run', date: 'Feb 10, 2026', time: '6:30 AM', location: 'Riverside Path' },
  ];

  const handleJoinSquad = () => {
    setIsMember(true);
    toast.success(`Successfully joined ${squad.name}!`);
  };

  const handleChallengeSquad = () => {
    toast.success(`Challenge sent to ${squad.name}!`);
  };

  const handleInviteFriends = () => {
    toast.success('Invite sent to your friends!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-[#FC8936] via-[#FF9A56] to-[#FFA666] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="absolute top-4 left-4 bg-white/90 hover:bg-white shadow-lg text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white shadow-lg">
              <Share2 className="w-4 h-4" />
            </Button>
            {isMember && (
              <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white shadow-lg">
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Squad Info */}
        <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Squad Avatar */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <AvatarImage src={squad.avatar} alt={squad.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white text-3xl font-bold">
                    {squad.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FC8936] to-[#E67A2E] text-white border-4 border-white">
                  {squad.sport}
                </Badge>
              </div>

              {/* Squad Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{squad.name}</h1>
                    <p className="text-gray-600 text-lg mb-3">{squad.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>New York, NY</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Public Squad</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-[#003C66] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#003C66]">{stats.members}</p>
                    <p className="text-xs text-gray-600">Members</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-[#FC8936] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#FC8936]">{stats.activities}</p>
                    <p className="text-xs text-gray-600">Activities</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                    <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
                    <p className="text-xs text-gray-600">Avg Rating</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{stats.weeklyGoal}%</p>
                    <p className="text-xs text-gray-600">Weekly Goal</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 whitespace-nowrap">
                {isMember ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                      disabled
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Already Joined
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-[#FC8936] text-[#FC8936] hover:bg-[#FC8936] hover:text-white shadow-lg"
                      onClick={handleChallengeSquad}
                    >
                      <Swords className="w-5 h-5 mr-2" />
                      Challenge Squad
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white shadow-lg"
                      onClick={handleJoinSquad}
                    >
                      <UserPlus2 className="w-5 h-5 mr-2" />
                      Join Squad
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-[#003C66] text-[#003C66] hover:bg-[#003C66] hover:text-white shadow-lg"
                      onClick={handleInviteFriends}
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Invite Friends
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FC8936]" />
                Squad Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                    <p className="text-sm font-medium text-gray-900">{achievement.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Activities */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FC8936]" />
                Upcoming Activities
              </h2>
              <div className="space-y-3">
                {upcomingActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl hover:shadow-md transition-shadow border border-orange-100">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {activity.date}
                        </span>
                        <span>{activity.time}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </span>
                      </div>
                    </div>
                    {isMember && (
                      <Button size="sm" variant="outline" className="border-[#FC8936] text-[#FC8936] hover:bg-[#FC8936] hover:text-white">
                        Join
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Members Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FC8936]" />
                Squad Members ({stats.members})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:shadow-md transition-shadow border border-gray-100">
                    <Avatar className="h-12 w-12 border-2 border-[#FC8936]">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate flex items-center gap-2">
                        {member.name}
                        {member.role === 'Captain' && <Crown className="w-4 h-4 text-yellow-600" />}
                      </p>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-[#FC8936] text-[#FC8936] hover:bg-[#FC8936] hover:text-white">
                View All Members
              </Button>
            </Card>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Squad Info Card */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-2 border-[#FC8936]/20">
              <h3 className="font-bold text-gray-900 mb-4">Squad Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Created</p>
                  <p className="font-medium text-gray-900">January 2023</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Category</p>
                  <Badge className="bg-[#FC8936] text-white">{squad.sport}</Badge>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Activity Level</p>
                  <p className="font-medium text-gray-900">Moderate - High</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Meeting Frequency</p>
                  <p className="font-medium text-gray-900">3-4 times per week</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Age Range</p>
                  <p className="font-medium text-gray-900">20-45 years</p>
                </div>
              </div>
            </Card>

            {/* Join Requirements Card */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Join Requirements</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FC8936] rounded-full mt-1.5" />
                  <span>Must be committed to attending at least 2 activities per week</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FC8936] rounded-full mt-1.5" />
                  <span>Respectful and supportive team player</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FC8936] rounded-full mt-1.5" />
                  <span>Willing to work towards personal and group fitness goals</span>
                </li>
              </ul>
            </Card>

            {/* Challenge Info Card */}
            {!isMember && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-[#003C66]/20">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Swords className="w-5 h-5 text-[#003C66]" />
                  Challenge This Squad
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Test your skills against {squad.name} in a friendly competition!
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#003C66] rounded-full mt-1.5" />
                    <span>Set challenge terms and goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#003C66] rounded-full mt-1.5" />
                    <span>Track progress in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#003C66] rounded-full mt-1.5" />
                    <span>Win badges and rewards</span>
                  </li>
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}