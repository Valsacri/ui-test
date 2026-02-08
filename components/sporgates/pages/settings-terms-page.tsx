"use client"

interface SettingsTermsPageProps {
  onBack: () => void
}

export function SettingsTermsPage({ onBack }: SettingsTermsPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated Feb 2026</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm text-sm text-muted-foreground space-y-4">
        <p>By using Sporgates, you agree to follow our community guidelines and respect other members.</p>
        <p>Bookings are subject to facility policies. Please review cancellation rules before confirming a reservation.</p>
        <p>Payments and wallet transactions are processed through trusted partners for your security.</p>
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
