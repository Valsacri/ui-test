import { Home, Compass, Target, User, Building2 } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { motion } from 'motion/react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  userType?: 'user' | 'business' | 'sponsor';
}

export function BottomNav({ activeTab, onTabChange, userType = 'user' }: BottomNavProps) {
  const userNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'activities', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const businessNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'business', label: 'Business', icon: <Building2 className="w-5 h-5" /> },
  ];

  const navItems = userType === 'business' ? businessNavItems : userNavItems;

  return null;
}