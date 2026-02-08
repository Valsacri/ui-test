import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  ArrowLeft, 
  UserPlus, 
  Briefcase, 
  Search, 
  MapPin, 
  Mail,
  Check,
  DollarSign,
  Calendar,
  Users,
  Shield
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface AddTeamMemberProps {
  onBack: () => void;
}

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  skills: string[];
}

export function AddTeamMember({ onBack }: AddTeamMemberProps) {
  const [activeTab, setActiveTab] = useState<'add-user' | 'recruit'>('add-user');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  
  // Form states for recruitment
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [jobLocation, setJobLocation] = useState('');

  // Mock users data
  const users: User[] = [
    {
      id: '1',
      name: 'Jordan Martinez',
      username: '@jordan_fit',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
      bio: 'Certified personal trainer with 5 years experience',
      location: 'New York, NY',
      skills: ['Personal Training', 'Nutrition', 'CrossFit'],
    },
    {
      id: '2',
      name: 'Emily Watson',
      username: '@emily_yoga',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      bio: 'Yoga instructor specializing in mindfulness',
      location: 'Los Angeles, CA',
      skills: ['Yoga', 'Meditation', 'Wellness'],
    },
    {
      id: '3',
      name: 'Michael Chang',
      username: '@mike_coach',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      bio: 'Sports coach and athlete development specialist',
      location: 'Chicago, IL',
      skills: ['Coaching', 'Sports Science', 'Team Management'],
    },
    {
      id: '4',
      name: 'Sofia Rodriguez',
      username: '@sofia_pilates',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
      bio: 'Pilates instructor and rehabilitation expert',
      location: 'Miami, FL',
      skills: ['Pilates', 'Rehabilitation', 'Core Training'],
    },
    {
      id: '5',
      name: 'David Kim',
      username: '@david_strength',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      bio: 'Strength and conditioning coach',
      location: 'Austin, TX',
      skills: ['Strength Training', 'Athletic Performance', 'Injury Prevention'],
    },
    {
      id: '6',
      name: 'Rachel Green',
      username: '@rachel_wellness',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
      bio: 'Holistic wellness coach and nutritionist',
      location: 'Seattle, WA',
      skills: ['Nutrition', 'Wellness Coaching', 'Meal Planning'],
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddSelectedUsers = () => {
    // Show role assignment section
    setShowRoleAssignment(true);
  };

  const handleConfirmAddUsers = () => {
    // Handle adding selected users with roles
    console.log('Adding users with roles:', selectedUsers.map(userId => ({
      userId,
      role: userRoles[userId] || 'Staff'
    })));
    onBack();
  };

  const handlePostJob = () => {
    // Handle posting job
    console.log('Posting job:', {
      jobTitle,
      jobDescription,
      jobRole,
      jobSalary,
      jobType,
      jobLocation,
    });
    onBack();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Team Member</h1>
              <p className="text-sm text-gray-500 mt-1">
                Invite existing users or recruit for a new position
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-user" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Existing User
          </TabsTrigger>
          <TabsTrigger value="recruit" className="gap-2">
            <Briefcase className="w-4 h-4" />
            Recruit New Position
          </TabsTrigger>
        </TabsList>

        {/* Add Existing User Tab */}
        <TabsContent value="add-user" className="mt-6">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Select Users to Add
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search and select users from the Sporgates platform
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, username, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Selected Count */}
                {selectedUsers.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-[#003C66]">
                      {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                    <Button
                      onClick={handleAddSelectedUsers}
                      className="bg-[#FC8936] hover:bg-[#E67A2F]"
                      size="sm"
                    >
                      Add to Team
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.includes(user.id);

                  return (
                    <Card
                      key={user.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#003C66] border-2 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.username}</p>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2">{user.bio}</p>

                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{user.location}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {user.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {user.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{user.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No users found matching your search</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Assignment Section */}
          {showRoleAssignment && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Assign Roles
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Assign roles to the selected users
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    if (!user) return null;

                    return (
                      <div key={userId} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.username}</p>
                          </div>
                        </div>

                        <Select value={userRoles[userId]} onValueChange={value => setUserRoles(prev => ({ ...prev, [userId]: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instructor">Instructor</SelectItem>
                            <SelectItem value="coach">Coach</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="trainer">Trainer</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleConfirmAddUsers}
                      className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
                      disabled={selectedUsers.length === 0}
                    >
                      <Briefcase className="w-4 h-4" />
                      Add Users with Roles
                    </Button>
                    <Button variant="outline" onClick={onBack}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recruit New Position Tab */}
        <TabsContent value="recruit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Post a Job Opening
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create a job listing to recruit new team members
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div className="md:col-span-2">
                    <Label htmlFor="job-title">Job Title *</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g., Personal Trainer, Yoga Instructor"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  {/* Role/Department */}
                  <div>
                    <Label htmlFor="job-role">Role/Department *</Label>
                    <Select value={jobRole} onValueChange={setJobRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="trainer">Trainer</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Type */}
                  <div>
                    <Label htmlFor="job-type">Job Type *</Label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <Label htmlFor="job-salary">Salary Range</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="job-salary"
                        placeholder="e.g., 50,000 - 70,000/year"
                        value={jobSalary}
                        onChange={(e) => setJobSalary(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="job-location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="job-location"
                        placeholder="e.g., New York, NY or Remote"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <Label htmlFor="job-description">Job Description *</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Describe the role, responsibilities, requirements, and qualifications..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                  />
                </div>

                {/* Preview Card */}
                {(jobTitle || jobDescription) && (
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Preview
                    </h4>
                    <Card className="border-2 border-dashed">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {jobTitle || 'Job Title'}
                            </h3>
                            {jobRole && (
                              <Badge variant="secondary" className="mt-2">
                                {jobRole}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {jobType && (
                              <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                <span>{jobType}</span>
                              </div>
                            )}
                            {jobLocation && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{jobLocation}</span>
                              </div>
                            )}
                            {jobSalary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{jobSalary}</span>
                              </div>
                            )}
                          </div>

                          {jobDescription && (
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {jobDescription}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handlePostJob}
                    className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
                    disabled={!jobTitle || !jobDescription || !jobRole || !jobType}
                  >
                    <Briefcase className="w-4 h-4" />
                    Post Job Opening
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}