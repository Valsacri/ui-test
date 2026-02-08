import { useState } from 'react';
import { ArrowLeft, UserPlus, Mail, MoreVertical, Shield, Crown, Users } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { TopBar } from '@/app/components/TopBar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'manager' | 'staff';
  joinedDate: string;
  status: 'active' | 'pending';
}

interface TeamManagementProps {
  onBack: () => void;
  onNotifications?: () => void;
  onMessages?: () => void;
  onProfile?: () => void;
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@sportsgym.com',
    role: 'owner',
    joinedDate: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@sportsgym.com',
    role: 'manager',
    joinedDate: '2024-02-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@sportsgym.com',
    role: 'staff',
    joinedDate: '2024-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'Alex Kim',
    email: 'alex@sportsgym.com',
    role: 'staff',
    joinedDate: '2024-03-15',
    status: 'pending',
  },
];

const roleConfig = {
  owner: {
    label: 'Owner',
    icon: Crown,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    permissions: 'Full access to all business features',
  },
  manager: {
    label: 'Manager',
    icon: Shield,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    permissions: 'Can manage resources, customers, and team members',
  },
  staff: {
    label: 'Staff',
    icon: Users,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    permissions: 'Can view and assist with operations',
  },
};

export function TeamManagement({ 
  onBack,
  onNotifications,
  onMessages,
  onProfile,
}: TeamManagementProps) {
  const [teamMembers] = useState<TeamMember[]>(MOCK_TEAM);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'staff'>('staff');

  const handleInvite = () => {
    // Handle invite logic
    console.log('Inviting:', inviteEmail, inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar
        title="Team Management"
        onBack={onBack}
        onNotifications={onNotifications}
        onMessages={onMessages}
        onProfile={onProfile}
      />

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team Members</h1>
            <p className="text-sm text-muted-foreground">
              {teamMembers.filter(m => m.status === 'active').length} active members
            </p>
          </div>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="gap-2 bg-[#003C66] hover:bg-[#002A4A]"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        {/* Role Descriptions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Team Roles</h3>
            <div className="space-y-2">
              {Object.entries(roleConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <div key={key} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{config.label}</p>
                      <p className="text-xs text-muted-foreground">{config.permissions}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <div className="space-y-3">
          {teamMembers.map((member) => {
            const roleInfo = roleConfig[member.role];
            const RoleIcon = roleInfo.icon;
            
            return (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-[#003C66] text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{member.name}</p>
                        {member.status === 'pending' && (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={`${roleInfo.color} text-xs`}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleInfo.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    {member.role !== 'owner' && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <div className="space-y-2">
                    {(['manager', 'staff'] as const).map((role) => {
                      const config = roleConfig[role];
                      const Icon = config.icon;
                      return (
                        <button
                          key={role}
                          onClick={() => setInviteRole(role)}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                            inviteRole === role
                              ? 'border-[#003C66] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${config.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{config.label}</p>
                            <p className="text-xs text-muted-foreground">{config.permissions}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail}
                  className="flex-1 bg-[#003C66] hover:bg-[#002A4A]"
                >
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
