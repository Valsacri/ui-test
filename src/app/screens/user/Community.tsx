import { useState } from 'react';
import { Users, Search, Trophy, MapPin, ChevronRight, Zap, Target, Plus, Filter, UserPlus, MessageCircle, Award, TrendingUp, ChevronDown, Check } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { PageHeader } from '@/app/components/PageHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface CommunityProps {
  onSquadClick: (squadId: string) => void;
  onPersonClick?: (personId: string) => void;
}

type MainTabType = 'squads' | 'people' | 'groups';
type SquadTabType = 'all-squads' | 'my-squads';
type PeopleTabType = 'all-people' | 'my-connections';
type GroupTabType = 'all-groups' | 'my-groups';

export function Community({ onSquadClick, onPersonClick }: CommunityProps) {
  const [mainTab, setMainTab] = useState<MainTabType>('people');
  const [squadTab, setSquadTab] = useState<SquadTabType>('all-squads');
  const [peopleTab, setPeopleTab] = useState<PeopleTabType>('all-people');
  const [groupTab, setGroupTab] = useState<GroupTabType>('all-groups');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for all squads
  const allSquads = [
    {
      id: 'squad-1',
      name: 'NYC Morning Runners',
      sport: 'Running',
      members: 24,
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200',
      description: 'Early morning running group for all skill levels',
      isJoined: true,
      activityLevel: 'High',
      nextActivity: 'Tomorrow, 6:00 AM',
    },
    {
      id: 'squad-2',
      name: 'Basketball Warriors',
      sport: 'Basketball',
      members: 18,
      location: 'Brooklyn, NY',
      avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200',
      description: 'Competitive basketball squad looking for skilled players',
      isJoined: false,
      activityLevel: 'High',
      nextActivity: 'Friday, 7:00 PM',
    },
    {
      id: 'squad-3',
      name: 'Yoga Enthusiasts',
      sport: 'Yoga',
      members: 32,
      location: 'Manhattan, NY',
      avatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200',
      description: 'Mindful movement and meditation for inner peace',
      isJoined: true,
      activityLevel: 'Moderate',
      nextActivity: 'Wednesday, 8:00 AM',
    },
    {
      id: 'squad-4',
      name: 'CrossFit Champions',
      sport: 'CrossFit',
      members: 15,
      location: 'Queens, NY',
      avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200',
      description: 'Intense CrossFit training for serious athletes',
      isJoined: false,
      activityLevel: 'Very High',
      nextActivity: 'Daily, 6:00 AM',
    },
    {
      id: 'squad-5',
      name: 'Cycling Squad',
      sport: 'Cycling',
      members: 28,
      location: 'Central Park, NY',
      avatar: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=200',
      description: 'Weekend cycling adventures around the city',
      isJoined: false,
      activityLevel: 'Moderate',
      nextActivity: 'Saturday, 7:00 AM',
    },
    {
      id: 'squad-6',
      name: 'Swimming Team',
      sport: 'Swimming',
      members: 21,
      location: 'Downtown, NY',
      avatar: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=200',
      description: 'Competitive swimming with professional coaching',
      isJoined: false,
      activityLevel: 'High',
      nextActivity: 'Monday, 5:30 AM',
    },
    {
      id: 'squad-7',
      name: 'Tennis Club',
      sport: 'Tennis',
      members: 16,
      location: 'Upper East Side, NY',
      avatar: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200',
      description: 'Tennis matches and training for all levels',
      isJoined: false,
      activityLevel: 'Moderate',
      nextActivity: 'Thursday, 6:00 PM',
    },
    {
      id: 'squad-8',
      name: 'Soccer League',
      sport: 'Soccer',
      members: 35,
      location: 'Brooklyn, NY',
      avatar: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=200',
      description: 'Competitive soccer league with weekly matches',
      isJoined: false,
      activityLevel: 'High',
      nextActivity: 'Sunday, 3:00 PM',
    },
  ];

  // Mock data for people
  const allPeople = [
    {
      id: 'user-1',
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      location: 'New York, NY',
      sports: ['Running', 'Yoga', 'Cycling'],
      level: 'Advanced',
      activities: 156,
      squads: 3,
      bio: 'Marathon runner and yoga instructor. Love connecting with fitness enthusiasts!',
      isConnected: true,
      mutualConnections: 12,
    },
    {
      id: 'user-2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      location: 'Brooklyn, NY',
      sports: ['Basketball', 'Swimming', 'Tennis'],
      level: 'Intermediate',
      activities: 89,
      squads: 2,
      bio: 'Basketball enthusiast and weekend warrior. Always up for a challenge!',
      isConnected: false,
      mutualConnections: 8,
    },
    {
      id: 'user-3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      location: 'Manhattan, NY',
      sports: ['Yoga', 'Pilates', 'Meditation'],
      level: 'Expert',
      activities: 234,
      squads: 4,
      bio: 'Certified yoga instructor with 10+ years of experience. Mindfulness advocate.',
      isConnected: true,
      mutualConnections: 15,
    },
    {
      id: 'user-4',
      name: 'James Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      location: 'Queens, NY',
      sports: ['CrossFit', 'Running', 'Boxing'],
      level: 'Advanced',
      activities: 178,
      squads: 3,
      bio: 'CrossFit coach and personal trainer. Pushing limits every day!',
      isConnected: false,
      mutualConnections: 5,
    },
    {
      id: 'user-5',
      name: 'Lisa Anderson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      location: 'Brooklyn, NY',
      sports: ['Swimming', 'Triathlon', 'Cycling'],
      level: 'Advanced',
      activities: 201,
      squads: 5,
      bio: 'Triathlete and endurance athlete. Training for Ironman 2026!',
      isConnected: false,
      mutualConnections: 10,
    },
    {
      id: 'user-6',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      location: 'Manhattan, NY',
      sports: ['Tennis', 'Badminton', 'Squash'],
      level: 'Intermediate',
      activities: 92,
      squads: 2,
      bio: 'Racket sports enthusiast. Looking for tennis partners!',
      isConnected: true,
      mutualConnections: 7,
    },
    {
      id: 'user-7',
      name: 'Amanda Foster',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      location: 'Upper West Side, NY',
      sports: ['Dancing', 'Zumba', 'Yoga'],
      level: 'Intermediate',
      activities: 145,
      squads: 3,
      bio: 'Dance fitness instructor spreading joy through movement!',
      isConnected: false,
      mutualConnections: 9,
    },
    {
      id: 'user-8',
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150',
      location: 'Bronx, NY',
      sports: ['Soccer', 'Football', 'Running'],
      level: 'Advanced',
      activities: 167,
      squads: 4,
      bio: 'Soccer coach and fitness enthusiast. Team player at heart!',
      isConnected: false,
      mutualConnections: 11,
    },
  ];

  const mySquads = allSquads.filter(squad => squad.isJoined);
  const myConnections = allPeople.filter(person => person.isConnected);

  const displayedSquads = squadTab === 'my-squads' ? mySquads : allSquads;
  const displayedPeople = peopleTab === 'my-connections' ? myConnections : allPeople;

  const filteredSquads = displayedSquads.filter(squad =>
    squad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    squad.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    squad.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPeople = displayedPeople.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.sports.some(sport => sport.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'Very High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Moderate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Advanced':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader
          title="Community"
          subtitle="Connect with people and join squads"
          icon={<Users className="w-7 h-7 text-[#FC8936]" />}
          showSearch
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${mainTab === 'squads' ? 'squads' : mainTab === 'groups' ? 'groups' : 'people'}...`}
          showFilter
          onFilterClick={() => {
            // Handle filter click
            console.log('Filter clicked');
          }}
        >
          {/* Main Tabs */}
          <Tabs defaultValue="people" value={mainTab} onValueChange={(value) => setMainTab(value as MainTabType)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="people" className="text-xs">
                <UserPlus className="w-4 h-4 mr-2" />
                People
              </TabsTrigger>
              <TabsTrigger value="squads" className="text-xs">
                <Users className="w-4 h-4 mr-2" />
                Squads
              </TabsTrigger>
              <TabsTrigger value="groups" className="text-xs">
                <Users className="w-4 h-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </PageHeader>

        {/* Create Button */}
        <div className="mt-4">
          {mainTab === 'people' ? (
            <Button className="w-full bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white">
              <Plus className="w-5 h-5 mr-2" />
              Invite Friends
            </Button>
          ) : (
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#003C66] text-[#003C66] hover:bg-[#003C66] hover:text-white justify-between"
                  >
                    {mainTab === 'squads' 
                      ? (squadTab === 'all-squads' ? 'All Squads' : 'My Squads')
                      : (groupTab === 'all-groups' ? 'All Groups' : 'My Groups')
                    }
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {mainTab === 'squads' ? (
                    <>
                      <DropdownMenuItem onClick={() => setSquadTab('all-squads')}>
                        <Users className="w-4 h-4 mr-2" />
                        All Squads
                        {squadTab === 'all-squads' && <Check className="w-4 h-4 ml-auto text-[#FC8936]" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSquadTab('my-squads')}>
                        <Users className="w-4 h-4 mr-2" />
                        My Squads
                        {squadTab === 'my-squads' && <Check className="w-4 h-4 ml-auto text-[#FC8936]" />}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => setGroupTab('all-groups')}>
                        <Users className="w-4 h-4 mr-2" />
                        All Groups
                        {groupTab === 'all-groups' && <Check className="w-4 h-4 ml-auto text-[#FC8936]" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupTab('my-groups')}>
                        <Users className="w-4 h-4 mr-2" />
                        My Groups
                        {groupTab === 'my-groups' && <Check className="w-4 h-4 ml-auto text-[#FC8936]" />}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="flex-1 bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white">
                <Plus className="w-5 h-5 mr-2" />
                {mainTab === 'squads' ? 'Create Squad' : 'Create Group'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {mainTab === 'squads' ? (
          // Squads Grid
          filteredSquads.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No squads found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search criteria' : 'No squads match your criteria'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSquads.map((squad) => (
                <Card
                  key={squad.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#FC8936] group"
                  onClick={() => onSquadClick(squad.id)}
                >
                  {/* Squad Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#003C66] to-[#005A99]">
                    <img
                      src={squad.avatar}
                      alt={squad.name}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      {squad.isJoined ? (
                        <Badge className="bg-green-500 text-white border-0">
                          <Users className="w-3 h-3 mr-1" />
                          Joined
                        </Badge>
                      ) : null}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-white/90 text-gray-900 border-0 font-semibold">
                        {squad.sport}
                      </Badge>
                    </div>
                  </div>

                  {/* Squad Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FC8936] transition-colors">
                      {squad.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{squad.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{squad.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{squad.members} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-gray-400" />
                        <Badge variant="outline" className={`text-xs ${getActivityLevelColor(squad.activityLevel)}`}>
                          {squad.activityLevel}
                        </Badge>
                      </div>
                    </div>

                    {/* Next Activity */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Next Activity</p>
                      <p className="text-sm font-semibold text-gray-900">{squad.nextActivity}</p>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full ${
                        squad.isJoined
                          ? 'bg-gradient-to-r from-[#003C66] to-[#005A99] hover:from-[#002d4d] hover:to-[#004d7a]'
                          : 'bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25]'
                      } text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSquadClick(squad.id);
                      }}
                    >
                      {squad.isJoined ? (
                        <>
                          View Squad
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Join Squad
                          <Plus className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          // People Grid
          filteredPeople.length === 0 ? (
            <Card className="p-12 text-center">
              <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No people found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search criteria' : 'No people match your criteria'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeople.map((person) => (
                <Card
                  key={person.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#003C66] group"
                  onClick={() => onPersonClick?.(person.id)}
                >
                  {/* Profile Header */}
                  <div className="relative h-32 bg-gradient-to-br from-[#003C66] to-[#005A99]">
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white text-2xl font-bold">
                          {person.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {person.isConnected && (
                      <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>

                  {/* Person Info */}
                  <div className="pt-14 p-5">
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-1 group-hover:text-[#003C66] transition-colors">
                      {person.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-3">
                      <MapPin className="w-3 h-3" />
                      <span>{person.location}</span>
                    </div>

                    <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">{person.bio}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-[#003C66]">{person.activities}</p>
                        <p className="text-xs text-gray-600">Activities</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-[#FC8936]">{person.squads}</p>
                        <p className="text-xs text-gray-600">Squads</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{person.mutualConnections}</p>
                        <p className="text-xs text-gray-600">Mutual</p>
                      </div>
                    </div>

                    {/* Sports & Level */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${getLevelColor(person.level)}`}>
                          {person.level}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {person.sports.slice(0, 3).map((sport, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {person.isConnected ? (
                        <>
                          <Button
                            className="flex-1 bg-gradient-to-r from-[#003C66] to-[#005A99] hover:from-[#002d4d] hover:to-[#004d7a] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPersonClick?.(person.id);
                            }}
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-[#003C66] text-[#003C66] hover:bg-[#003C66] hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle message
                            }}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="flex-1 bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle connect
                            }}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-[#FC8936] text-[#FC8936] hover:bg-[#FC8936] hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPersonClick?.(person.id);
                            }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}