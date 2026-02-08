"use client"

interface SettingsBlockedPageProps {
  onBack: () => void
}

const blockedUsers = [
  { id: "1", name: "Jordan Rivera", reason: "Spam" },
  { id: "2", name: "Maya Chen", reason: "Harassment" },
]

export function SettingsBlockedPage({ onBack }: SettingsBlockedPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blocked Users</h1>
        <p className="text-sm text-muted-foreground">Manage who you have blocked</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        {blockedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">Reason: {user.reason}</p>
            </div>
            <button type="button" className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground">
              Unblock
            </button>
          </div>
        ))}
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
