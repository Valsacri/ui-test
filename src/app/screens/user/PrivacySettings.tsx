import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { ChevronLeft, Eye, Lock, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface PrivacySettingsProps {
  onBack?: () => void;
}

export function PrivacySettings({ onBack }: PrivacySettingsProps) {
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [activityVisibility, setActivityVisibility] = useState<'everyone' | 'friends' | 'none'>('everyone');
  const [locationSharing, setLocationSharing] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowMessages, setAllowMessages] = useState<'everyone' | 'friends' | 'none'>('everyone');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const handleSave = () => {
    toast.success('Privacy settings updated!');
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Control who can see your information and activities
            </p>
          </div>
        </div>

        {/* Profile Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#003C66]" />
              Profile Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Who can see your profile?</Label>
              {['public', 'friends', 'private'].map((option) => (
                <button
                  key={option}
                  onClick={() => setProfileVisibility(option as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    profileVisibility === option
                      ? 'border-[#003C66] bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900 capitalize">{option}</span>
                    <span className="text-sm text-muted-foreground">
                      {option === 'public' && 'Everyone can see your profile'}
                      {option === 'friends' && 'Only your friends can see your profile'}
                      {option === 'private' && 'Only you can see your profile'}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      profileVisibility === option
                        ? 'border-[#003C66] bg-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {profileVisibility === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#003C66]" />
              Activity & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Share Location</p>
                <p className="text-sm text-muted-foreground">
                  Allow others to see your location in activities
                </p>
              </div>
              <ToggleSwitch
                enabled={locationSharing}
                onChange={() => setLocationSharing(!locationSharing)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Show Online Status</p>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're active
                </p>
              </div>
              <ToggleSwitch
                enabled={showOnlineStatus}
                onChange={() => setShowOnlineStatus(!showOnlineStatus)}
              />
            </div>

            <div className="pt-4 border-t space-y-3">
              <Label>Who can see your activities?</Label>
              {['everyone', 'friends', 'none'].map((option) => (
                <button
                  key={option}
                  onClick={() => setActivityVisibility(option as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    activityVisibility === option
                      ? 'border-[#003C66] bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-gray-900 capitalize">{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      activityVisibility === option
                        ? 'border-[#003C66] bg-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {activityVisibility === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#003C66]" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Show Email Address</p>
                <p className="text-sm text-muted-foreground">
                  Display your email on your public profile
                </p>
              </div>
              <ToggleSwitch
                enabled={showEmail}
                onChange={() => setShowEmail(!showEmail)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Show Phone Number</p>
                <p className="text-sm text-muted-foreground">
                  Display your phone number on your public profile
                </p>
              </div>
              <ToggleSwitch
                enabled={showPhone}
                onChange={() => setShowPhone(!showPhone)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Messaging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#003C66]" />
              Messaging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label>Who can send you messages?</Label>
              {['everyone', 'friends', 'none'].map((option) => (
                <button
                  key={option}
                  onClick={() => setAllowMessages(option as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    allowMessages === option
                      ? 'border-[#003C66] bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-gray-900 capitalize">{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      allowMessages === option
                        ? 'border-[#003C66] bg-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {allowMessages === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
