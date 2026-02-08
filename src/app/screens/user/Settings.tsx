import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Globe,
  Smartphone,
  Shield,
  HelpCircle,
  FileText,
  ChevronRight,
  Wallet,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SettingsProps {
  onNavigate?: (destination: string) => void;
  currentProfile?: 'user' | 'business';
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function Settings({
  onNavigate,
  currentProfile = 'user',
  userName = 'Alex Johnson',
  userEmail = 'alex.johnson@email.com',
  userAvatar,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'wallet'>('account');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const settingsSections = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', icon: User, action: 'profile-info' },
        { label: 'Language & Region', icon: Globe, action: 'language' },
      ],
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Privacy Settings', icon: Eye, action: 'privacy' },
        { label: 'Blocked Users', icon: EyeOff, action: 'blocked' },
        { label: 'Data & Permissions', icon: Shield, action: 'data' },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', icon: Bell, action: 'push' },
        { label: 'Email Preferences', icon: Bell, action: 'email' },
      ],
    },
    {
      id: 'wallet',
      label: 'Wallet & Payments',
      icon: Wallet,
      items: [
        { label: 'Wallet Balance', icon: Wallet, action: 'wallet' },
        { label: 'Payment Methods', icon: CreditCard, action: 'payment' },
        { label: 'Transaction History', icon: FileText, action: 'transactions' },
      ],
    },
  ];

  const legalItems = [
    { label: 'Terms of Service', icon: FileText, action: 'terms' },
    { label: 'Privacy Policy', icon: Shield, action: 'privacy-policy' },
    { label: 'Help & Support', icon: HelpCircle, action: 'help' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white text-lg">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{userName}</h2>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
                <Badge className="mt-2 bg-gradient-to-r from-[#003C66] to-[#005A99]">
                  {currentProfile === 'business' ? 'Business Account' : 'Personal Account'}
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => onNavigate?.('profile')}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsSections.map((section) => (
            <Card key={section.id}>
              <CardContent className="p-0">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <section.icon className="w-5 h-5 text-[#003C66]" />
                    <h3 className="font-semibold text-gray-900">{section.label}</h3>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {section.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const actionMap: Record<string, string> = {
                          'wallet': 'settings/wallet',
                          'profile-info': 'settings/profile-info',
                          'language': 'settings/language',
                          'privacy': 'settings/privacy',
                          'blocked': 'settings/blocked-users',
                          'data': 'settings/data-permissions',
                          'push': 'settings/notifications',
                          'email': 'settings/notifications',
                          'payment': 'settings/payment-methods',
                          'transactions': 'settings/transaction-history',
                        };
                        
                        const destination = actionMap[item.action];
                        if (destination) {
                          onNavigate?.(destination);
                        }
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legal & Support */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Legal & Support</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {legalItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const legalActionMap: Record<string, string> = {
                      'terms': 'settings/terms',
                      'privacy-policy': 'settings/privacy-policy',
                      'help': 'settings/help',
                    };
                    
                    const destination = legalActionMap[item.action];
                    if (destination) {
                      onNavigate?.(destination);
                    }
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground">
          Sporgates v1.0.0
        </div>
      </div>
    </div>
  );
}