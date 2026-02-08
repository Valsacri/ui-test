import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { 
  Search, Filter, UserCheck, Star, Instagram, 
  Users, TrendingUp, Award, MapPin, Plus 
} from 'lucide-react';

interface BusinessAthletesProps {
  onNavigate: (page: string, data?: any) => void;
}

// Mock data for athletes and influencers
const MOCK_ATHLETES = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: '@sarahfitness',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    sport: 'Fitness',
    verified: true,
    followers: '125K',
    engagement: '8.5%',
    location: 'New York, NY',
    bio: 'Professional fitness trainer & wellness coach. Inspiring healthy lifestyles.',
    tags: ['Fitness', 'Wellness', 'Nutrition'],
    previousCollabs: 3,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    username: '@marcusruns',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    sport: 'Running',
    verified: true,
    followers: '89K',
    engagement: '12.3%',
    location: 'Los Angeles, CA',
    bio: 'Marathon runner | Nike athlete | Sharing my running journey',
    tags: ['Running', 'Marathon', 'Endurance'],
    previousCollabs: 5,
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    username: '@emmayoga',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    sport: 'Yoga',
    verified: true,
    followers: '210K',
    engagement: '9.7%',
    location: 'Miami, FL',
    bio: 'Certified yoga instructor | Mindfulness advocate | Plant-based lifestyle',
    tags: ['Yoga', 'Meditation', 'Wellness'],
    previousCollabs: 8,
  },
  {
    id: '4',
    name: 'James Mitchell',
    username: '@jamescycling',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    sport: 'Cycling',
    verified: false,
    followers: '45K',
    engagement: '11.2%',
    location: 'Austin, TX',
    bio: 'Cyclist | Adventure seeker | Promoting outdoor activities',
    tags: ['Cycling', 'Adventure', 'Outdoor'],
    previousCollabs: 2,
  },
  {
    id: '5',
    name: 'Lisa Park',
    username: '@lisaswims',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    sport: 'Swimming',
    verified: true,
    followers: '156K',
    engagement: '10.8%',
    location: 'San Diego, CA',
    bio: 'Olympic swimmer | Swimming coach | Making waves in the pool',
    tags: ['Swimming', 'Olympics', 'Coaching'],
    previousCollabs: 6,
  },
  {
    id: '6',
    name: 'David Torres',
    username: '@davidhiit',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    sport: 'HIIT',
    verified: true,
    followers: '98K',
    engagement: '13.5%',
    location: 'Chicago, IL',
    bio: 'HIIT specialist | Personal trainer | Transform your body & mind',
    tags: ['HIIT', 'Strength', 'Conditioning'],
    previousCollabs: 4,
  },
];

export function BusinessAthletes({ onNavigate }: BusinessAthletesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const filteredAthletes = MOCK_ATHLETES.filter(athlete => {
    const matchesSearch = 
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.sport.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSport = !selectedSport || athlete.sport === selectedSport;
    
    return matchesSearch && matchesSport;
  });

  const sports = Array.from(new Set(MOCK_ATHLETES.map(a => a.sport)));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Athletes & Influencers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find and collaborate with athletes and influencers to grow your brand
          </p>
        </div>
        <Button 
          onClick={() => onNavigate('business-athletes-add-collab')}
          className="bg-[#FC8936] hover:bg-[#E67A2F]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Collaboration
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{MOCK_ATHLETES.length}</p>
            <p className="text-xs text-muted-foreground">Available Athletes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Active Collabs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">827K</p>
            <p className="text-xs text-muted-foreground">Total Reach</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-[#FC8936]" />
            <p className="text-2xl font-bold">10.5%</p>
            <p className="text-xs text-muted-foreground">Avg Engagement</p>
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
                placeholder="Search athletes by name, username, or sport..."
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
          
          {/* Sport filters */}
          <div className="flex gap-2 mt-3">
            <Button
              variant={selectedSport === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSport(null)}
              className={selectedSport === null ? "bg-[#003C66]" : ""}
            >
              All Sports
            </Button>
            {sports.map((sport) => (
              <Button
                key={sport}
                variant={selectedSport === sport ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSport(sport)}
                className={selectedSport === sport ? "bg-[#003C66]" : ""}
              >
                {sport}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Athletes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAthletes.map((athlete) => (
          <Card key={athlete.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Profile Header */}
              <div className="p-4 bg-gradient-to-r from-[#003C66] to-[#005A99] text-white">
                <div className="flex items-start gap-3">
                  <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage src={athlete.avatar} />
                    <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold truncate">{athlete.name}</h3>
                      {athlete.verified && (
                        <Award className="w-4 h-4 text-[#FC8936] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-white/80">{athlete.username}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-white/70">
                      <MapPin className="w-3 h-3" />
                      <span>{athlete.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="p-4 border-b">
                <p className="text-sm text-gray-600 line-clamp-2">{athlete.bio}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {athlete.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 grid grid-cols-3 gap-2 border-b">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Instagram className="w-3 h-3 text-pink-600" />
                  </div>
                  <p className="text-sm font-bold">{athlete.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  <p className="text-sm font-bold">{athlete.engagement}</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
                <div className="text-center">
                  <UserCheck className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-bold">{athlete.previousCollabs}</p>
                  <p className="text-xs text-muted-foreground">Collabs</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                <Button 
                  className="w-full bg-[#003C66] hover:bg-[#002A4A]"
                  onClick={() => onNavigate('business-athletes-add-collab', { athlete })}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Start Collaboration
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
      {filteredAthletes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-lg mb-2">No athletes found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
