import { Bell, MessageSquare, Search, Target, User, Building2, LogOut, Settings, Home, Calendar, Users, Dumbbell, CheckCircle2, ChevronLeft, ChevronRight, Compass, Wallet, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { cn } from '@/app/components/ui/utils';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface TopBarProps {
  onNotifications?: () => void;
  onMessages?: () => void;
  onProfile?: () => void;
  onGoals?: () => void;
  onSearch?: () => void;
  onBack?: () => void;
  onSwitchProfile?: (profileType: 'user' | 'business' | 'squad', profileId?: string) => void;
  onNavigate?: (destination: string) => void;
  onCreateBusiness?: () => void;
  onCreateSquad?: () => void;
  activeScreen?: string;
  notificationCount?: number;
  messageCount?: number;
  title?: string;
  currentProfile?: 'user' | 'business' | 'squad';
  userAvatar?: string;
  userName?: string;
  showSearch?: boolean;
  // Goal-related props
  goals?: Array<{
    id: string;
    title: string;
    progress: number;
  }>;
  // Profile data for switcher
  personalProfile?: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
  };
  businessProfiles?: Array<{
    id: string;
    name: string;
    avatar?: string;
    type?: string;
  }>;
  squadProfiles?: Array<{
    id: string;
    name: string;
    avatar?: string;
    memberCount?: number;
    sport?: string;
  }>;
  currentProfileId?: string;
  profileCompletion?: number;
}

export function TopBar({
  onNotifications,
  onMessages,
  onProfile,
  onGoals,
  onSearch,
  onBack,
  onSwitchProfile,
  onNavigate,
  onCreateBusiness,
  onCreateSquad,
  activeScreen,
  notificationCount = 0,
  messageCount = 0,
  title,
  currentProfile = 'user',
  userAvatar,
  userName = 'Alex Johnson',
  showSearch = true,
  goals = [],
  personalProfile,
  businessProfiles,
  squadProfiles,
  currentProfileId,
  profileCompletion = 75,
}: TopBarProps) {
  const [activeNav, setActiveNav] = useState('home');
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const currentGoal = goals[currentGoalIndex];

  const handlePrevGoal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentGoalIndex((prev) => (prev === 0 ? goals.length - 1 : prev - 1));
  };

  const handleNextGoal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentGoalIndex((prev) => (prev === goals.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-4 relative">
          {/* Left Section - Logo & Search */}
          <div className="flex items-center gap-2 w-80">
            <div className="w-10 h-10 bg-gradient-to-br from-[#003C66] to-[#005A99] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            
            {showSearch && (
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Sporgates"
                  className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003C66]/30 hover:bg-gray-200 transition-colors"
                  onClick={onSearch}
                />
              </div>
            )}
          </div>

          {/* Center Section - Current Goal */}
          <div className="hidden md:flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-full shadow-sm">
              <Target className="w-5 h-5 text-[#003C66]" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Current Goal:</span>
                <span className="text-sm font-semibold text-[#003C66]">Run 5K in 30 days</span>
              </div>
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-blue-200">
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#003C66] to-[#005A99] rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-xs font-medium text-[#003C66]">65%</span>
              </div>
            </div>
          </div>

          {/* Right Section - Widgets & Actions */}
          <div className="flex items-center gap-2 w-80 justify-end ml-auto">
            {/* Wallet */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="relative w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <Wallet className="w-5 h-5 text-gray-700" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mr-2 mt-2 rounded-xl shadow-xl border-gray-200 bg-white" align="end">
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Account Balance</p>
                    <p className="text-2xl font-bold text-[#003C66]">$2,450.00</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onNavigate?.('settings/wallet')}
                  className="cursor-pointer rounded-lg mx-2 my-2 p-3 bg-gradient-to-r from-[#003C66] to-[#005A99] text-white hover:from-[#002A4D] hover:to-[#004580] focus:bg-[#003C66] focus:text-white"
                >
                  <Wallet className="w-4 h-4 mr-3" />
                  <span className="font-medium">View Wallet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            {onMessages && (
              <button 
                onClick={onMessages}
                className="relative w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-gray-700" />
                {messageCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1.5 bg-[#FC8936] text-white text-xs border-2 border-white">
                    {messageCount}
                  </Badge>
                )}
              </button>
            )}

            {/* Notifications */}
            {onNotifications && (
              <button 
                onClick={onNotifications}
                className="relative w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1.5 bg-[#FC8936] text-white text-xs border-2 border-white">
                    {notificationCount}
                  </Badge>
                )}
              </button>
            )}

            {/* Profile Avatar Dropdown */}
            {onProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full p-0 hover:opacity-90 transition-opacity ring-2 ring-transparent hover:ring-gray-300">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white text-sm font-semibold">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mr-2 mt-2 rounded-xl shadow-xl border-gray-200 bg-white" align="end">
                  <DropdownMenuLabel className="font-normal p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" onClick={onProfile}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white text-sm font-semibold">
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-none truncate">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {currentProfile === 'business' ? '🏢 Business Account' : '👤 Personal Account'}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Personal Profile Section */}
                  <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-1.5">
                    Personal Profile
                  </DropdownMenuLabel>
                  {personalProfile && (
                    <DropdownMenuItem
                      onClick={() => onSwitchProfile?.('user', personalProfile.id)}
                      className={cn(
                        'cursor-pointer rounded-lg mx-1 my-0.5 p-3',
                        currentProfile === 'user' && currentProfileId === personalProfile.id ? 'bg-blue-50 border border-blue-200' : ''
                      )}
                    >
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage src={personalProfile.avatar} alt={personalProfile.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white text-xs">
                          {getInitials(personalProfile.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{personalProfile.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{personalProfile.email}</p>
                      </div>
                      {currentProfile === 'user' && currentProfileId === personalProfile.id && (
                        <Badge className="ml-2 bg-gradient-to-r from-[#003C66] to-[#005A99] text-white text-xs" variant="secondary">Active</Badge>
                      )}
                    </DropdownMenuItem>
                  )}

                  {/* Business Profiles Section */}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-1.5">
                    Business Profiles
                  </DropdownMenuLabel>
                  {businessProfiles && businessProfiles.length > 0 && (
                    <>
                      {businessProfiles.map((profile) => (
                        <DropdownMenuItem
                          key={profile.id}
                          onClick={() => onSwitchProfile?.('business', profile.id)}
                          className={cn(
                            'cursor-pointer rounded-lg mx-1 my-0.5 p-3',
                            currentProfile === 'business' && currentProfileId === profile.id ? 'bg-blue-50 border border-blue-200' : ''
                          )}
                        >
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={profile.avatar} alt={profile.name} />
                            <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white text-xs">
                              {getInitials(profile.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{profile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{profile.type}</p>
                          </div>
                          {currentProfile === 'business' && currentProfileId === profile.id && (
                            <Badge className="ml-2 bg-gradient-to-r from-[#003C66] to-[#005A99] text-white text-xs" variant="secondary">Active</Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={onCreateBusiness}
                    className="cursor-pointer rounded-lg mx-1 my-0.5 text-[#003C66] font-medium hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    <span>Create New Business</span>
                  </DropdownMenuItem>

                  {/* Squad Profiles Section */}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-1.5">
                    Squad Profiles
                  </DropdownMenuLabel>
                  {squadProfiles && squadProfiles.length > 0 && (
                    <>
                      {squadProfiles.map((profile) => (
                        <DropdownMenuItem
                          key={profile.id}
                          onClick={() => onSwitchProfile?.('squad', profile.id)}
                          className={cn(
                            'cursor-pointer rounded-lg mx-1 my-0.5 p-3',
                            currentProfile === 'squad' && currentProfileId === profile.id ? 'bg-orange-50 border border-orange-200' : ''
                          )}
                        >
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={profile.avatar} alt={profile.name} />
                            <AvatarFallback className="bg-gradient-to-br from-[#FC8936] to-[#E67A2E] text-white text-xs">
                              {getInitials(profile.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{profile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{profile.sport}</p>
                          </div>
                          {currentProfile === 'squad' && currentProfileId === profile.id && (
                            <Badge className="ml-2 bg-gradient-to-r from-[#FC8936] to-[#E67A2E] text-white text-xs" variant="secondary">Active</Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={onCreateSquad}
                    className="cursor-pointer rounded-lg mx-1 my-0.5 text-[#003C66] font-medium hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    <span>Create New Squad</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => onNavigate?.('settings')} className="cursor-pointer rounded-lg mx-1 my-0.5">
                    <Settings className="w-4 h-4 mr-3 text-gray-600" />
                    <span className="font-medium">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 cursor-pointer rounded-lg mx-1 my-0.5 mb-1">
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}