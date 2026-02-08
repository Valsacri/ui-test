"use client"

interface SettingsWalletPageProps {
  onBack: () => void
}

const transactions = [
  { id: "1", label: "Basketball session", amount: -25, date: "Feb 2, 2026" },
  { id: "2", label: "Wallet top-up", amount: 100, date: "Feb 1, 2026" },
  { id: "3", label: "Refund", amount: 15, date: "Jan 30, 2026" },
]

export function SettingsWalletPage({ onBack }: SettingsWalletPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        <p className="text-sm text-muted-foreground">Track your balance and activity</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Available Balance</p>
        <p className="text-3xl font-bold text-primary">$285.50</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" className="gradient-primary rounded-xl py-2 text-sm font-semibold text-white">Add Funds</button>
          <button type="button" className="rounded-xl border border-border py-2 text-sm font-semibold text-foreground">Withdraw</button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-foreground">{tx.label}</p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </div>
            <span className={tx.amount >= 0 ? "text-green-600" : "text-foreground"}>
              {tx.amount >= 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
            </span>
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
