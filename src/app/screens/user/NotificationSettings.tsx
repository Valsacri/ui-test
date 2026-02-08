import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ChevronLeft, Bell, Mail, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  onBack?: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  // Push Notifications
  const [pushActivities, setPushActivities] = useState(true);
  const [pushMessages, setPushMessages] = useState(true);
  const [pushGoals, setPushGoals] = useState(true);
  const [pushSponsorships, setPushSponsorships] = useState(true);
  const [pushEvents, setPushEvents] = useState(true);

  // Email Notifications
  const [emailActivities, setEmailActivities] = useState(true);
  const [emailMessages, setEmailMessages] = useState(false);
  const [emailNewsletter, setEmailNewsletter] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(false);
  const [emailWeeklySummary, setEmailWeeklySummary] = useState(true);

  const handleSave = () => {
    toast.success('Notification preferences updated!');
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#003C66]' : 'bg-gray-300'
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
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose how you want to be notified
            </p>
          </div>
        </div>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#003C66]" />
              Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Activity Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about upcoming activities and changes
                </p>
              </div>
              <ToggleSwitch
                enabled={pushActivities}
                onChange={() => setPushActivities(!pushActivities)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Messages</p>
                <p className="text-sm text-muted-foreground">
                  New messages from other users
                </p>
              </div>
              <ToggleSwitch
                enabled={pushMessages}
                onChange={() => setPushMessages(!pushMessages)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Goal Progress</p>
                <p className="text-sm text-muted-foreground">
                  Updates on your fitness goals and achievements
                </p>
              </div>
              <ToggleSwitch
                enabled={pushGoals}
                onChange={() => setPushGoals(!pushGoals)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Sponsorship Opportunities</p>
                <p className="text-sm text-muted-foreground">
                  New sponsorships and rewards available
                </p>
              </div>
              <ToggleSwitch
                enabled={pushSponsorships}
                onChange={() => setPushSponsorships(!pushSponsorships)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Events & Announcements</p>
                <p className="text-sm text-muted-foreground">
                  Special events and platform updates
                </p>
              </div>
              <ToggleSwitch
                enabled={pushEvents}
                onChange={() => setPushEvents(!pushEvents)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#003C66]" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Activity Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Email reminders for upcoming activities
                </p>
              </div>
              <ToggleSwitch
                enabled={emailActivities}
                onChange={() => setEmailActivities(!emailActivities)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Message Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get emails when you receive new messages
                </p>
              </div>
              <ToggleSwitch
                enabled={emailMessages}
                onChange={() => setEmailMessages(!emailMessages)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">
                  Weekly recap of your activities and progress
                </p>
              </div>
              <ToggleSwitch
                enabled={emailWeeklySummary}
                onChange={() => setEmailWeeklySummary(!emailWeeklySummary)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Newsletter</p>
                <p className="text-sm text-muted-foreground">
                  Tips, updates, and community highlights
                </p>
              </div>
              <ToggleSwitch
                enabled={emailNewsletter}
                onChange={() => setEmailNewsletter(!emailNewsletter)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Promotions & Offers</p>
                <p className="text-sm text-muted-foreground">
                  Special deals and promotional content
                </p>
              </div>
              <ToggleSwitch
                enabled={emailPromotions}
                onChange={() => setEmailPromotions(!emailPromotions)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#003C66]" />
              Quiet Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Set a time range when you don't want to receive push notifications
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
                <input
                  type="time"
                  defaultValue="22:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003C66]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
          <Button
            className="w-full bg-[#003C66] hover:bg-[#002A4A]"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
