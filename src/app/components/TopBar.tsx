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
  goals?: Array<{
    id: string;
    title: string;
    progress: number;
  }>;
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
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex items-center h-[3.75rem] gap-3">
          {/* Left Section - Logo & Search */}
          <div className="flex items-center gap-3 w-72 flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-base">S</span>
            </div>
            
            {showSearch && (
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Sporgates"
                  className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card border border-transparent focus:border-border transition-all"
                  onClick={onSearch}
                />
              </div>
            )}
          </div>

          {/* Center Section - Current Goal */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg border border-border">
              <Target className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Goal:</span>
                <span className="text-sm font-medium text-foreground">Run 5K in 30 days</span>
              </div>
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
                <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
                </div>
                <span className="text-xs font-semibold text-primary">65%</span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1.5 w-72 justify-end flex-shrink-0">
            {/* Wallet */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-9 h-9 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors">
                  <Wallet className="w-[18px] h-[18px] text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl shadow-lg border-border" align="end" sideOffset={8}>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Account Balance</p>
                    <p className="text-2xl font-bold text-primary">$2,450.00</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onNavigate?.('settings/wallet')}
                  className="cursor-pointer rounded-lg mx-2 my-1 p-3 bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  <span className="font-medium">View Wallet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            {onMessages && (
              <button 
                onClick={onMessages}
                className="relative w-9 h-9 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageSquare className="w-[18px] h-[18px] text-muted-foreground" />
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center px-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full border-2 border-card">
                    {messageCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications */}
            {onNotifications && (
              <button 
                onClick={onNotifications}
                className="relative w-9 h-9 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
              >
                <Bell className="w-[18px] h-[18px] text-muted-foreground" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center px-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full border-2 border-card">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Avatar Dropdown */}
            {onProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-lg p-0 hover:opacity-90 transition-all ring-2 ring-transparent hover:ring-primary/20 overflow-hidden">
                    <Avatar className="h-9 w-9 rounded-lg">
                      <AvatarImage src={userAvatar} alt={userName} className="rounded-lg" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-xl shadow-lg border-border" align="end" sideOffset={8}>
                  <DropdownMenuLabel className="font-normal p-3 cursor-pointer hover:bg-muted rounded-lg transition-colors" onClick={onProfile}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={userAvatar} alt={userName} className="rounded-lg" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold rounded-lg">
                          {getInitials(userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-none truncate">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1.5">
                          {currentProfile === 'business' ? 'Business Account' : 'Personal Account'}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Personal Profile */}
                  <DropdownMenuLabel className="text-[10px] text-muted-foreground px-3 py-1.5 font-semibold uppercase tracking-wider">
                    Personal
                  </DropdownMenuLabel>
                  {personalProfile && (
                    <DropdownMenuItem
                      onClick={() => onSwitchProfile?.('user', personalProfile.id)}
                      className={cn(
                        'cursor-pointer rounded-lg mx-1.5 my-0.5 p-2.5 transition-colors',
                        currentProfile === 'user' && currentProfileId === personalProfile.id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted'
                      )}
                    >
                      <Avatar className="h-8 w-8 mr-2.5 rounded-lg">
                        <AvatarImage src={personalProfile.avatar} alt={personalProfile.name} className="rounded-lg" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs rounded-lg">
                          {getInitials(personalProfile.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{personalProfile.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{personalProfile.email}</p>
                      </div>
                      {currentProfile === 'user' && currentProfileId === personalProfile.id && (
                        <Badge className="ml-1 bg-primary text-primary-foreground text-[10px]" variant="secondary">Active</Badge>
                      )}
                    </DropdownMenuItem>
                  )}

                  {/* Business Profiles */}
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuLabel className="text-[10px] text-muted-foreground px-3 py-1.5 font-semibold uppercase tracking-wider">
                    Business
                  </DropdownMenuLabel>
                  {businessProfiles && businessProfiles.length > 0 && (
                    <>
                      {businessProfiles.map((profile) => (
                        <DropdownMenuItem
                          key={profile.id}
                          onClick={() => onSwitchProfile?.('business', profile.id)}
                          className={cn(
                            'cursor-pointer rounded-lg mx-1.5 my-0.5 p-2.5 transition-colors',
                            currentProfile === 'business' && currentProfileId === profile.id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted'
                          )}
                        >
                          <Avatar className="h-8 w-8 mr-2.5 rounded-lg">
                            <AvatarImage src={profile.avatar} alt={profile.name} className="rounded-lg" />
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs rounded-lg">
                              {getInitials(profile.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{profile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{profile.type}</p>
                          </div>
                          {currentProfile === 'business' && currentProfileId === profile.id && (
                            <Badge className="ml-1 bg-primary text-primary-foreground text-[10px]" variant="secondary">Active</Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={onCreateBusiness}
                    className="cursor-pointer rounded-lg mx-1.5 my-0.5 text-primary font-medium hover:bg-primary/5 p-2.5"
                  >
                    <Plus className="w-4 h-4 mr-2.5" />
                    <span>Create New Business</span>
                  </DropdownMenuItem>

                  {/* Squad Profiles */}
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuLabel className="text-[10px] text-muted-foreground px-3 py-1.5 font-semibold uppercase tracking-wider">
                    Squads
                  </DropdownMenuLabel>
                  {squadProfiles && squadProfiles.length > 0 && (
                    <>
                      {squadProfiles.map((profile) => (
                        <DropdownMenuItem
                          key={profile.id}
                          onClick={() => onSwitchProfile?.('squad', profile.id)}
                          className={cn(
                            'cursor-pointer rounded-lg mx-1.5 my-0.5 p-2.5',
                            currentProfile === 'squad' && currentProfileId === profile.id ? 'bg-secondary/5 border border-secondary/20' : 'hover:bg-muted'
                          )}
                        >
                          <Avatar className="h-8 w-8 mr-2.5 rounded-lg">
                            <AvatarImage src={profile.avatar} alt={profile.name} className="rounded-lg" />
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs rounded-lg">
                              {getInitials(profile.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{profile.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{profile.sport}</p>
                          </div>
                          {currentProfile === 'squad' && currentProfileId === profile.id && (
                            <Badge className="ml-1 bg-secondary text-secondary-foreground text-[10px]" variant="secondary">Active</Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={onCreateSquad}
                    className="cursor-pointer rounded-lg mx-1.5 my-0.5 text-primary font-medium hover:bg-primary/5 p-2.5"
                  >
                    <Plus className="w-4 h-4 mr-2.5" />
                    <span>Create New Squad</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-1.5" />
                  <DropdownMenuItem onClick={() => onNavigate?.('settings')} className="cursor-pointer rounded-lg mx-1.5 my-0.5 p-2.5">
                    <Settings className="w-4 h-4 mr-2.5 text-muted-foreground" />
                    <span className="font-medium">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive cursor-pointer rounded-lg mx-1.5 my-0.5 mb-1.5 p-2.5">
                    <LogOut className="w-4 h-4 mr-2.5" />
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
