import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { TopBar } from '@/app/components/TopBar';
import { 
  ArrowLeft,
  Users,
  UserPlus,
  Share2,
  Calendar,
  Trophy,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { MOCK_SQUAD_PROFILES, MOCK_ACTIVITIES } from '@/app/data/mockData';
import { PEOPLE } from '@/app/data/exploreData';
import { toast } from 'sonner';

/**
 * SquadDetail - Squad Profile View
 * 
 * This component displays detailed information about a squad including:
 * - Squad information and stats
 * - Member list with avatars
 * - Upcoming squad activities
 * - Join/Leave squad actions
 */

interface SquadDetailProps {
  squadId: string;
  onBack: () => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
  onPersonClick?: (personId: string) => void;
  onActivityClick?: (activityId: string) => void;
}

export function SquadDetail({ 
  squadId,
  onBack, 
  onNotifications, 
  onMessages, 
  onProfile,
  onPersonClick,
  onActivityClick
}: SquadDetailProps) {
  const [isJoined, setIsJoined] = useState(false);
  
  const squad = MOCK_SQUAD_PROFILES.find(s => s.id === squadId) || MOCK_SQUAD_PROFILES[0];
  
  // Mock squad members (using PEOPLE data)
  const squadMembers = PEOPLE.slice(0, 6);
  
  // Mock squad activities
  const squadActivities = MOCK_ACTIVITIES.filter(a => a.sport === squad.sport).slice(0, 3);

  const handleJoinSquad = () => {
    setIsJoined(!isJoined);
    toast.success(isJoined ? `Left ${squad.name}` : `Joined ${squad.name}!`);
  };

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
            src={squad.avatar}
            alt={squad.name}
            className="w-full h-full object-cover opacity-60"
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

        {/* Squad Info */}
        <div className="px-4 pb-6">
          <div className="bg-white rounded-lg p-6 -mt-16 relative z-10 shadow-lg mb-6">
            {/* Logo & Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={squad.avatar} alt={squad.name} />
                <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white text-2xl">
                  {squad.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{squad.name}</h1>
                <p className="text-muted-foreground mb-2">{squad.description}</p>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {squad.sport}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#003C66]">{squad.memberCount}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#FC8936]">{squad.activityCount}</p>
                <p className="text-xs text-muted-foreground">Activities</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-xs text-muted-foreground">Active Rate</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={handleJoinSquad}
                className={isJoined ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-[#003C66] hover:bg-[#002A4A]'}
              >
                {isJoined ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Joined
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Squad
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite Friends
              </Button>
            </div>
          </div>

          {/* Members Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-[#003C66]" />
                Members ({squadMembers.length})
              </h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {squadMembers.map((member) => (
                <Card 
                  key={member.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onPersonClick?.(member.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Activities */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FC8936]" />
                Upcoming Activities
              </h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {squadActivities.map((activity) => (
                <Card 
                  key={activity.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onActivityClick?.(activity.id)}
                >
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
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{activity.participants}/{activity.maxParticipants}</span>
                          </div>
                          <Badge variant="secondary">{activity.sport}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
