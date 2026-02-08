import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { ChevronLeft, UserX, Search } from 'lucide-react';
import { toast } from 'sonner';

interface BlockedUsersProps {
  onBack?: () => void;
}

const MOCK_BLOCKED_USERS = [
  {
    id: '1',
    name: 'John Doe',
    username: '@johndoe',
    avatar: '',
    blockedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: '@janesmith',
    avatar: '',
    blockedDate: '2024-01-10',
  },
];

export function BlockedUsers({ onBack }: BlockedUsersProps) {
  const [blockedUsers, setBlockedUsers] = useState(MOCK_BLOCKED_USERS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUnblock = (userId: string, userName: string) => {
    setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
    toast.success(`${userName} has been unblocked`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Blocked Users</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage users you've blocked from contacting you
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search blocked users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Blocked Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-[#003C66]" />
              Blocked Users ({blockedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'No users found' : 'No blocked users'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? 'Try a different search term' : 'You haven\'t blocked anyone yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#003C66] to-[#005A99] text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Blocked on {new Date(user.blockedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnblock(user.id, user.name)}
                      className="text-[#003C66] border-[#003C66] hover:bg-primary hover:text-white"
                    >
                      Unblock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="p-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">About Blocking</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#003C66] mt-0.5">•</span>
                  <span>Blocked users cannot send you messages or see your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003C66] mt-0.5">•</span>
                  <span>They won't be notified that you've blocked them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003C66] mt-0.5">•</span>
                  <span>You can unblock users at any time</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
