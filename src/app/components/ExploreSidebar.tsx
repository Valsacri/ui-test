import { Card, CardContent } from '@/app/components/ui/card';
import { 
  Building2, Dumbbell, ShoppingBag, Trophy, MapPin, Briefcase, 
  Store, Compass, Home, Wrench, Users 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ExploreSidebarProps {
  onNavigate?: (destination: string) => void;
  currentPage?: string;
}

export function ExploreSidebar({ onNavigate, currentPage }: ExploreSidebarProps) {
  const exploreItems = [
    { id: 'home', icon: Home, label: 'Home', destination: 'feed' },
    { id: 'explore', icon: Compass, label: 'Explore', destination: 'explore' },
    { id: 'activities', icon: Dumbbell, label: 'Activities', destination: 'activities' },
    { id: 'facilities', icon: Building2, label: 'Facilities', destination: 'facilities' },
    { id: 'marketplace', icon: Store, label: 'Marketplace', destination: 'marketplace' },
    { id: 'services', icon: Wrench, label: 'Services', destination: 'services' },
    { id: 'community', icon: Users, label: 'Community', destination: 'community' },
    { id: 'jobs', icon: Briefcase, label: 'Jobs', destination: 'jobs' },
  ];

  return (
    <div className="space-y-4 sticky top-[3.75rem] max-h-[calc(100vh-3.75rem)] overflow-y-auto pb-4">
      {/* Navigation */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-2">
          <nav className="space-y-0.5">
            {exploreItems.map((item) => {
              const Icon = item.icon;
              const isSelected = currentPage === item.destination || 
                (!currentPage && item.id === 'home') ||
                (currentPage === 'home' && item.id === 'home');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.destination)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                      : 'text-foreground hover:bg-muted font-normal'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Featured Card */}
      <Card className="border-border overflow-hidden shadow-sm">
        <div className="bg-primary p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-secondary" />
            <p className="text-xs font-medium text-primary-foreground/70">Featured</p>
          </div>
          <h3 className="font-semibold text-sm text-primary-foreground mb-1.5">Upgrade to Premium</h3>
          <p className="text-xs text-primary-foreground/60 mb-3 leading-relaxed">
            Unlock exclusive events, advanced tracking, and more.
          </p>
          <Button
            size="sm"
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-8 text-xs"
            onClick={() => onNavigate?.('premium')}
          >
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
}
