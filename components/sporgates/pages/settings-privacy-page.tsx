"use client"

interface SettingsPrivacyPageProps {
  onBack: () => void
}

const privacyOptions = [
  { label: "Public", description: "Anyone can see your profile" },
  { label: "Friends", description: "Only friends can see your profile" },
  { label: "Private", description: "Only you can see your profile" },
]

export function SettingsPrivacyPage({ onBack }: SettingsPrivacyPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Privacy & Security</h1>
        <p className="text-sm text-muted-foreground">Control who can see your information</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div>
          <p className="text-sm font-semibold text-foreground">Profile Visibility</p>
          <div className="mt-3 space-y-3">
            {privacyOptions.map((option, index) => (
              <button
                key={option.label}
                type="button"
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                  index === 0 ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div>
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <span className={`h-3 w-3 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground">Account Security</p>
          <div className="mt-3 space-y-3 text-sm text-muted-foreground">
            <p>Password last updated: 3 weeks ago</p>
            <p>Two-factor authentication: Enabled</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
        >
          Back to Settings
        </button>
      </div>
    </div>
  )
}
