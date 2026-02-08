import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Target, Trophy, Activity, Dumbbell, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
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
    <div className="space-y-4 sticky top-[3.5rem] max-h-[calc(100vh-3.5rem)] overflow-y-auto pb-4">
      {/* Profile Card */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center -mt-2">
            <button 
              onClick={onProfile}
              className="w-20 h-20 bg-[#003C66] rounded-full flex items-center justify-center mb-4 hover:opacity-90 transition-opacity"
            >
              {userAvatar ? (
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-[#003C66] text-white text-2xl font-bold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <span className="text-white text-3xl font-bold">{getInitials(userName)}</span>
              )}
            </button>
            <h3 className="font-bold text-lg mb-1">{userName}</h3>
            <p className="text-sm text-gray-600 mb-4">{userEmail}</p>

            {/* Profile Completion */}
            <div className="w-full">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Profile Completion
              </p>
              <div className="relative">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#003C66] rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="text-center font-bold text-[#003C66] mt-2">{profileCompletion}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Goals Card */}
      {goals.length > 0 && currentGoal && (
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-[#003C66]" />
                Target Goals
              </CardTitle>
              {goals.length > 1 && (
                <span className="text-xs text-gray-500">{currentGoalIndex + 1}/{goals.length}</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{currentGoal.title}</p>
                <span className="text-sm font-bold text-[#003C66]">
                  {Math.round(currentGoal.progress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#003C66] to-[#FC8936] rounded-full transition-all duration-300"
                  style={{ width: `${currentGoal.progress}%` }}
                />
              </div>
            </div>

            {goals.length > 1 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevGoal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#003C66]" />
                </button>
                <button
                  onClick={onGoals}
                  className="text-xs text-[#003C66] font-medium hover:underline"
                >
                  View All Goals
                </button>
                <button
                  onClick={handleNextGoal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-[#003C66]" />
                </button>
              </div>
            )}

            {goals.length === 1 && onGoals && (
              <button
                onClick={onGoals}
                className="w-full text-xs text-[#003C66] font-medium hover:underline pt-2"
              >
                View Goal Details
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Friends Suggestions Card */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Suggested Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            <div className="flex-shrink-0 w-40">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">JD</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm mb-1 truncate">John Davis</p>
                  <p className="text-xs text-gray-500 mb-3 truncate">Runs marathons</p>
                  <Button size="sm" className="w-full h-8 bg-[#003C66] hover:bg-[#002A4A]">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex-shrink-0 w-40">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-lg">SM</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm mb-1 truncate">Sarah Miller</p>
                  <p className="text-xs text-gray-500 mb-3 truncate">Yoga enthusiast</p>
                  <Button size="sm" className="w-full h-8 bg-[#003C66] hover:bg-[#002A4A]">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex-shrink-0 w-40">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-lg">MC</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm mb-1 truncate">Mike Chen</p>
                  <p className="text-xs text-gray-500 mb-3 truncate">Cyclist · 12 mutual</p>
                  <Button size="sm" className="w-full h-8 bg-[#003C66] hover:bg-[#002A4A]">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex-shrink-0 w-40">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="bg-green-100 text-green-600 font-semibold text-lg">LW</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm mb-1 truncate">Lisa Wang</p>
                  <p className="text-xs text-gray-500 mb-3 truncate">Tennis player</p>
                  <Button size="sm" className="w-full h-8 bg-[#003C66] hover:bg-[#002A4A]">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <button className="w-full text-xs text-[#003C66] font-medium hover:underline pt-3 mt-2 border-t">
            See All Suggestions
          </button>
        </CardContent>
      </Card>
    </div>
  );
}