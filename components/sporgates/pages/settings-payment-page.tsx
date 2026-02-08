"use client"

interface SettingsPaymentPageProps {
  onBack: () => void
}

const paymentMethods = [
  { id: "1", type: "Visa", last4: "4242", expiry: "12/25", default: true },
  { id: "2", type: "Mastercard", last4: "8888", expiry: "06/26", default: false },
]

export function SettingsPaymentPage({ onBack }: SettingsPaymentPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
        <p className="text-sm text-muted-foreground">Manage your saved cards</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {method.type} •••• {method.last4}
              </p>
              <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
            </div>
            {method.default && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">Default</span>
            )}
          </div>
        ))}
        <button type="button" className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white">
          Add New Card
        </button>
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
