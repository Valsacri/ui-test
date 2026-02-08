import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { X } from 'lucide-react';

interface AddTeamMemberModalProps {
  onClose: () => void;
}

export function AddTeamMemberModal({ onClose }: AddTeamMemberModalProps) {
  const [role, setRole] = useState<'Owner' | 'Manager' | 'Staff'>('Staff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Adding new team member');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add Team Member</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="member-name">Full Name</Label>
              <Input id="member-name" placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="member-email">Email</Label>
              <Input id="member-email" type="email" placeholder="john@example.com" required />
            </div>
            <div>
              <Label htmlFor="member-role">Role</Label>
              <select
                id="member-role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
            <div>
              <Label htmlFor="member-phone">Phone (optional)</Label>
              <Input id="member-phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#003C66] hover:bg-[#002A4A]">
                Add Member
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
