"use client"

import { useState } from "react"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, DollarSign, RefreshCw, Search } from "lucide-react"
import { userProfile, transactionHistory } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface SettingsWalletPageProps {
  onBack: () => void
}

const filters = ["All", "Payments", "Deposits", "Refunds"]

export function SettingsWalletPage({ onBack }: SettingsWalletPageProps) {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredTransactions = transactionHistory.filter((tx) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Payments") return tx.type === "payment"
    if (activeFilter === "Deposits") return tx.type === "deposit"
    if (activeFilter === "Refunds") return tx.type === "refund"
    return true
  })

  const totalSpent = transactionHistory.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalDeposited = transactionHistory.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet & Transactions</h1>
        <p className="text-sm text-muted-foreground">Track your balance and transaction history</p>
      </div>

      {/* Balance Card */}
      <div className="gradient-primary overflow-hidden rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">Available Balance</p>
            <p className="text-3xl font-bold">${userProfile.walletBalance.toFixed(2)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-[#003C66] transition-opacity hover:opacity-90"
          >
            <ArrowDownLeft className="h-4 w-4" />
            Add Funds
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/30 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ArrowUpRight className="h-4 w-4" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <DollarSign className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-lg font-bold text-foreground">${totalDeposited.toFixed(0)}</p>
          <p className="text-[10px] text-muted-foreground">Total Deposited</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <TrendingUp className="mx-auto mb-1 h-5 w-5 text-secondary" />
          <p className="text-lg font-bold text-foreground">${totalSpent.toFixed(0)}</p>
          <p className="text-[10px] text-muted-foreground">Total Spent</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <RefreshCw className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-lg font-bold text-foreground">{transactionHistory.length}</p>
          <p className="text-[10px] text-muted-foreground">Transactions</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">Transaction History</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-border px-5 py-3 scrollbar-hide">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  tx.type === "payment" && "bg-red-100 text-red-600",
                  tx.type === "deposit" && "bg-green-100 text-green-600",
                  tx.type === "refund" && "bg-secondary/10 text-secondary"
                )}
              >
                {tx.type === "payment" && <ArrowUpRight className="h-4 w-4" />}
                {tx.type === "deposit" && <ArrowDownLeft className="h-4 w-4" />}
                {tx.type === "refund" && <RefreshCw className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{tx.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{tx.date}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      tx.status === "completed" && "bg-green-100 text-green-700",
                      tx.status === "pending" && "bg-yellow-100 text-yellow-700"
                    )}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "text-sm font-bold",
                  tx.amount > 0 ? "text-green-600" : "text-foreground"
                )}
              >
                {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
