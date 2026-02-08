import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  MessageCircle,
  UserPlus,
  Trophy,
  Target,
  Calendar,
  Users,
} from 'lucide-react';
import { PEOPLE } from '@/app/data/exploreData';
import { MOCK_SQUAD_PROFILES } from '@/app/data/mockData';
import { toast } from 'sonner';

interface PersonDetailProps {
  personId: string;
  onBack: () => void;
  onMessage: (personId: string) => void;
  onSquadClick?: (squadId: string) => void;
}

export function PersonDetail({ personId, onBack, onMessage, onSquadClick }: PersonDetailProps) {
  const person = PEOPLE.find(p => p.id === personId);

  if (!person) {
    return null;
  }

  const handleFollow = () => {
    toast.success(`You're now following ${person.name}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-600 to-green-600 h-48">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                <AvatarImage src={person.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-2xl">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{person.name}</h1>
                {person.verified && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                )}
              </div>

              <p className="text-muted-foreground mb-4">{person.bio}</p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{person.location}</span>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {person.followers.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">1.2K</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">245</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full max-w-md mb-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  onClick={handleFollow}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onMessage(person.id)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>

              {/* Invite to Squad Button */}
              <Button
                variant="outline"
                className="w-full max-w-md border-2 border-[#FC8936] text-[#FC8936] hover:bg-[#FC8936] hover:text-white"
                onClick={() => toast.success('Squad invitation sent!')}
              >
                <Users className="w-4 h-4 mr-2" />
                Invite to Squad
              </Button>
            </div>

            {/* Sports */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Sports & Activities</h3>
              <div className="flex flex-wrap gap-2">
                {person.sports.map((sport) => (
                  <Badge key={sport} variant="secondary" className="text-sm">
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Squads Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#003C66]" />
                Squads ({MOCK_SQUAD_PROFILES.slice(0, 2).length})
              </h3>
              <div className="space-y-3">
                {MOCK_SQUAD_PROFILES.slice(0, 2).map((squad) => (
                  <Card 
                    key={squad.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSquadClick?.(squad.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={squad.avatar} alt={squad.name} />
                          <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white">
                            {squad.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{squad.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{squad.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {squad.memberCount} members
                            </span>
                            <Badge variant="secondary" className="text-xs">{squad.sport}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="mb-6">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback>
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <p className="font-semibold">{person.name}</p>
                        {person.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{i} days ago</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">
                    Great workout session today! Feeling stronger every day 💪
                  </p>
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg mb-3" />
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>❤️ 124 likes</span>
                    <span>💬 23 comments</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="mt-4 space-y-4">
            {/* Achievements Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Achievements
              </h3>
              <div className="space-y-3 mb-6">
                {[
                  { title: '100 Day Streak', description: 'Completed activities for 100 consecutive days', color: 'yellow' },
                  { title: 'Marathon Master', description: 'Ran 5 marathons this year', color: 'blue' },
                  { title: 'Team Player', description: 'Participated in 50+ group activities', color: 'green' }
                ].map((achievement, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 bg-${achievement.color}-100 rounded-lg`}>
                          <Trophy className={`w-5 h-5 text-${achievement.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Past Events Section */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Past Events Joined
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Morning Run Group', date: '3 weeks ago', sport: 'Running' },
                  { title: 'HIIT Bootcamp', date: '1 month ago', sport: 'Fitness' },
                  { title: 'Basketball Tournament', date: '2 months ago', sport: 'Basketball' }
                ].map((event, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Joined {event.date}
                          </p>
                          <Badge variant="secondary">{event.sport}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}