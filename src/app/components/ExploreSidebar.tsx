import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Building2, Dumbbell, Calendar, ShoppingBag, Trophy, MapPin, ChevronRight, Briefcase, Store, Compass, Home, Award, Wrench, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ExploreSidebarProps {
  onNavigate?: (destination: string) => void;
  currentPage?: string;
}

export function ExploreSidebar({ onNavigate, currentPage }: ExploreSidebarProps) {
  const exploreItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      description: 'Your personal feed',
      color: 'bg-[#003C66] text-white',
      destination: 'feed',
    },
    {
      id: 'explore',
      icon: Compass,
      label: 'Explore',
      description: 'Discover everything',
      color: 'bg-[#003C66] text-white',
      destination: 'explore',
    },
    {
      id: 'activities',
      icon: Dumbbell,
      label: 'Activities',
      description: 'Join sports & fitness events',
      color: 'bg-[#003C66] text-white',
      destination: 'activities',
    },
    {
      id: 'facilities',
      icon: Building2,
      label: 'Facilities',
      description: 'Gyms, courts & training centers',
      color: 'bg-[#003C66] text-white',
      destination: 'facilities',
    },
    {
      id: 'marketplace',
      icon: Store,
      label: 'Marketplace',
      description: 'Sports gear & equipment',
      color: 'bg-[#003C66] text-white',
      destination: 'marketplace',
    },
    {
      id: 'services',
      icon: Wrench,
      label: 'Services',
      description: 'Training & wellness services',
      color: 'bg-[#003C66] text-white',
      destination: 'services',
    },
    {
      id: 'community',
      icon: Users,
      label: 'Community',
      description: 'Connect with people & squads',
      color: 'bg-[#003C66] text-white',
      destination: 'community',
    },
    {
      id: 'jobs',
      icon: Briefcase,
      label: 'Jobs',
      description: 'Careers in sports & fitness',
      color: 'bg-[#003C66] text-white',
      destination: 'jobs',
    },
  ];

  return (
    <div className="space-y-4 sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-4">
      {/* Explore Card */}
      <Card className="border border-gray-200">
        <CardContent className="space-y-2 pt-6">
          {exploreItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentPage === item.destination;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.destination)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                  isSelected 
                    ? 'bg-blue-50 border-2 border-[#003C66]' 
                    : 'border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-semibold text-sm ${isSelected ? 'text-[#003C66]' : ''}`}>{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-colors ${
                  isSelected ? 'text-[#003C66]' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Sponsored Card */}
      <Card className="border border-gray-200 bg-gradient-to-br from-[#003C66] to-[#004d7a] text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-[#FC8936]" />
            <p className="text-xs font-medium text-gray-200">Featured</p>
          </div>
          <h3 className="font-bold text-sm mb-2">Upgrade to Premium</h3>
          <p className="text-xs text-gray-300 mb-3">
            Unlock exclusive events, advanced tracking, and more!
          </p>
          <Button
            size="sm"
            className="w-full bg-[#FC8936] hover:bg-[#e57a2f] text-white"
            onClick={() => onNavigate?.('premium')}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}