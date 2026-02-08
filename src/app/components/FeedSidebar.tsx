import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Target, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  progress: number;
}

interface FeedSidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  profileCompletion?: number;
  stats?: {
    leaguesJoined: number;
    activities: number;
    workouts: number;
  };
  goals?: Goal[];
  onProfile?: () => void;
  onGoals?: () => void;
}

export function FeedSidebar({
  userName = 'Mary M Franke',
  userEmail = 'azefdezre@gmail.com',
  userAvatar,
  profileCompletion = 30,
  stats = {
    leaguesJoined: 3,
    activities: 12,
    workouts: 28,
  },
  goals = [],
  onProfile,
  onGoals,
}: FeedSidebarProps) {
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const currentGoal = goals[currentGoalIndex];

  const handlePrevGoal = () => {
    setCurrentGoalIndex((prev) => (prev === 0 ? goals.length - 1 : prev - 1));
  };

  const handleNextGoal = () => {
    setCurrentGoalIndex((prev) => (prev === goals.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4 sticky top-[3.75rem] max-h-[calc(100vh-3.75rem)] overflow-y-auto pb-4">
      {/* Profile Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col items-center text-center">
            <button 
              onClick={onProfile}
              className="mb-3 hover:opacity-90 transition-opacity"
            >
              <Avatar className="w-16 h-16 rounded-xl">
                <AvatarImage src={userAvatar} alt={userName} className="rounded-xl" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold rounded-xl">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
            </button>
            <h3 className="font-semibold text-base text-foreground mb-0.5">{userName}</h3>
            <p className="text-xs text-muted-foreground mb-4">{userEmail}</p>

            {/* Profile Completion */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Profile</p>
                <p className="text-xs font-semibold text-primary">{profileCompletion}%</p>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Goals Card */}
      {goals.length > 0 && currentGoal && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Goals
              </CardTitle>
              {goals.length > 1 && (
                <span className="text-[10px] text-muted-foreground">{currentGoalIndex + 1}/{goals.length}</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-foreground">{currentGoal.title}</p>
                <span className="text-xs font-bold text-primary">
                  {Math.round(currentGoal.progress)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${currentGoal.progress}%` }}
                />
              </div>
            </div>

            {goals.length > 1 && (
              <div className="flex items-center justify-between pt-1">
                <button onClick={handlePrevGoal} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={onGoals} className="text-[11px] text-primary font-medium hover:underline">
                  View All Goals
                </button>
                <button onClick={handleNextGoal} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Friend Suggestions */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Suggested Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {[
              { initials: 'JD', name: 'John Davis', desc: 'Runs marathons', bg: 'bg-blue-50', color: 'text-blue-600' },
              { initials: 'SM', name: 'Sarah Miller', desc: 'Yoga enthusiast', bg: 'bg-green-50', color: 'text-green-600' },
              { initials: 'MC', name: 'Mike Chen', desc: 'Cyclist', bg: 'bg-secondary/10', color: 'text-secondary' },
            ].map((friend) => (
              <div key={friend.initials} className="flex-shrink-0 w-32">
                <div className="border border-border rounded-xl p-3 text-center hover:shadow-sm transition-shadow">
                  <Avatar className="w-10 h-10 mx-auto mb-2 rounded-lg">
                    <AvatarFallback className={`${friend.bg} ${friend.color} font-semibold text-sm rounded-lg`}>
                      {friend.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-xs text-foreground mb-0.5 truncate">{friend.name}</p>
                  <p className="text-[10px] text-muted-foreground mb-2 truncate">{friend.desc}</p>
                  <Button size="sm" className="w-full h-7 bg-primary hover:bg-primary/90 text-[10px]">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full text-[11px] text-primary font-medium hover:underline pt-2.5 mt-2 border-t border-border">
            See All Suggestions
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
