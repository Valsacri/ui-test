"use client"

interface SettingsPrivacyPolicyPageProps {
  onBack: () => void
}

export function SettingsPrivacyPolicyPage({ onBack }: SettingsPrivacyPolicyPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">How we protect your data</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-sm text-muted-foreground space-y-4">
        <p>We collect only the data needed to deliver your sports experiences and improve the platform.</p>
        <p>Your personal information is never sold. You can manage visibility in Privacy Settings.</p>
        <p>We use industry-standard encryption and secure storage for sensitive data.</p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
      >
        Back to Settings
      </button>
    </div>
  )
}
