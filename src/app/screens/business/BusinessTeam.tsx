import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Plus, Users, Crown, Settings, Mail, MoreVertical, UserCog, Briefcase, Shield, Phone } from 'lucide-react';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface BusinessTeamProps {
  onAddTeamMember?: () => void;
  onTeamManagement?: () => void;
}

// Mock data for team members
const teamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@fitnesshub.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    permissions: ['Full Access'],
    joinedDate: 'Jan 2023',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@fitnesshub.com',
    phone: '+1 (555) 234-5678',
    role: 'manager',
    permissions: ['Manage Activities', 'View Reports'],
    joinedDate: 'Mar 2023',
    avatar: 'https://i.pravatar.cc/150?img=12',
    status: 'active',
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@fitnesshub.com',
    phone: '+1 (555) 345-6789',
    role: 'coach',
    permissions: ['Manage Sessions', 'View Customers'],
    joinedDate: 'May 2023',
    avatar: 'https://i.pravatar.cc/150?img=9',
    status: 'active',
  },
];

const roles = [
  { name: 'Admins', count: 1, color: 'bg-purple-100 text-purple-700' },
  { name: 'Managers', count: 1, color: 'bg-blue-100 text-blue-700' },
  { name: 'Coaches', count: 1, color: 'bg-green-100 text-green-700' },
  { name: 'Trainers', count: 1, color: 'bg-orange-100 text-orange-700' },
];

export function BusinessTeam({ onAddTeamMember }: BusinessTeamProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        title="Team Management"
        subtitle="Manage staff members and permissions"
        actions={
          <Button 
            onClick={onAddTeamMember}
            className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        }
        filterControls={
          <FilterBar
            inline
            search={{
              value: searchQuery,
              onChange: setSearchQuery,
              placeholder: 'Search team members...',
            }}
            filters={[
              {
                id: 'role',
                label: 'Role',
                value: roleFilter,
                onChange: setRoleFilter,
                placeholder: 'All Roles',
                options: [
                  { label: 'All Roles', value: 'all' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Manager', value: 'manager' },
                  { label: 'Coach', value: 'coach' },
                  { label: 'Trainer', value: 'trainer' },
                ],
              },
            ]}
            showFilters={showFilters}
            onToggleFilters={setShowFilters}
          />
        }
      >
        {/* Filter Panel */}
        {showFilters && (
          <FilterBar
            filters={[
              {
                id: 'role',
                label: 'Role',
                value: roleFilter,
                onChange: setRoleFilter,
                placeholder: 'All Roles',
                options: [
                  { label: 'All Roles', value: 'all' },
                  { label: 'Admin', value: 'admin' },
                  { label: 'Manager', value: 'manager' },
                  { label: 'Coach', value: 'coach' },
                  { label: 'Trainer', value: 'trainer' },
                ],
              },
            ]}
            showFilters={true}
            showToggle={false}
          />
        )}
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCog className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Roles Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roles.map((role, index) => (
              <div key={index} className={`${role.color} rounded-lg p-4`}>
                <p className="text-sm font-medium mb-1">{role.name}</p>
                <p className="text-2xl font-bold">{role.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                All staff members and their roles
              </p>
            </div>
            <Button variant="outline" onClick={onTeamManagement}>
              Advanced Management
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge 
                        variant={member.role === 'Owner' ? 'default' : 'secondary'}
                        className={member.role === 'Owner' ? 'bg-[#003C66]' : ''}
                      >
                        {member.role}
                      </Badge>
                      {member.status === 'active' && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.permissions.map((permission, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Permissions
                    </Button>
                    {member.role !== 'Owner' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permission Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
              <p className="font-semibold mb-1">Owner</p>
              <p className="text-sm text-gray-600">Full access to all features including business settings, billing, and team management</p>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <p className="font-semibold mb-1">Manager</p>
              <p className="text-sm text-gray-600">Can manage activities, customers, resources, and view analytics</p>
            </div>
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
              <p className="font-semibold mb-1">Coach/Instructor</p>
              <p className="text-sm text-gray-600">Can manage assigned activities and track attendance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}