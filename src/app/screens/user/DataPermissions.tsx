import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ChevronLeft, Shield, Download, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';

interface DataPermissionsProps {
  onBack?: () => void;
}

export function DataPermissions({ onBack }: DataPermissionsProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReportsEnabled, setCrashReportsEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);

  const handleDownloadData = () => {
    toast.success('Your data download request has been submitted. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    toast.error('Please contact support to delete your account');
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
            <h1 className="text-2xl font-bold text-gray-900">Data & Permissions</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage how your data is collected and used
            </p>
          </div>
        </div>

        {/* Data Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#003C66]" />
              Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Analytics & Usage Data</p>
                <p className="text-sm text-muted-foreground">
                  Help us improve the app by sharing usage statistics
                </p>
              </div>
              <ToggleSwitch
                enabled={analyticsEnabled}
                onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Crash Reports</p>
                <p className="text-sm text-muted-foreground">
                  Automatically send crash reports to help fix bugs
                </p>
              </div>
              <ToggleSwitch
                enabled={crashReportsEnabled}
                onChange={() => setCrashReportsEnabled(!crashReportsEnabled)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Personalization</p>
                <p className="text-sm text-muted-foreground">
                  Use my data to personalize recommendations
                </p>
              </div>
              <ToggleSwitch
                enabled={personalizationEnabled}
                onChange={() => setPersonalizationEnabled(!personalizationEnabled)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Third-Party Data Sharing</p>
                <p className="text-sm text-muted-foreground">
                  Share anonymized data with our partners
                </p>
              </div>
              <ToggleSwitch
                enabled={thirdPartySharing}
                onChange={() => setThirdPartySharing(!thirdPartySharing)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Download Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#003C66]" />
              Download Your Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download a copy of your Sporgates data including profile information, activities,
              and messages. You'll receive an email when your data is ready.
            </p>
            <Button
              variant="outline"
              className="w-full border-[#003C66] text-[#003C66] hover:bg-[#003C66] hover:text-white"
              onClick={handleDownloadData}
            >
              <Download className="w-4 h-4 mr-2" />
              Request Data Download
            </Button>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#003C66]" />
              App Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-muted-foreground">
                    Used to show nearby activities and facilities
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">Granted</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Camera</p>
                  <p className="text-sm text-muted-foreground">
                    For profile photos and QR code scanning
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">Granted</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    For activity updates and messages
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600">Granted</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> To modify app permissions, go to your device settings
                  and find Sporgates in the apps list.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Account deletion requires verification. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
