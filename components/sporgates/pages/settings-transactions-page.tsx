"use client"

import { useState } from "react"
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search, Download, Filter } from "lucide-react"
import { transactionHistory } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface SettingsTransactionsPageProps {
  onBack: () => void
}

const filters = ["All", "Payments", "Deposits", "Refunds"]

export function SettingsTransactionsPage({ onBack }: SettingsTransactionsPageProps) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = transactionHistory.filter((t) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Payments" && t.type === "payment") ||
      (activeFilter === "Deposits" && t.type === "deposit") ||
      (activeFilter === "Refunds" && t.type === "refund")
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalSpent = transactionHistory.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
  const totalDeposited = transactionHistory.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
          <p className="text-sm text-muted-foreground">View all your receipts and payments</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Total Spent</p>
              <p className="text-lg font-bold text-foreground">${Math.abs(totalSpent).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Total Deposited</p>
              <p className="text-lg font-bold text-foreground">${totalDeposited.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              activeFilter === filter
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">No transactions found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={cn(
                "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50",
                index < filteredTransactions.length - 1 && "border-b border-border"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                transaction.type === "payment" && "bg-red-100",
                transaction.type === "deposit" && "bg-green-100",
                transaction.type === "refund" && "bg-blue-100"
              )}>
                {transaction.amount < 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownLeft className={cn("h-4 w-4", transaction.type === "refund" ? "text-blue-500" : "text-green-600")} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{transaction.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{transaction.date}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span className="capitalize">{transaction.id}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-bold",
                  transaction.amount < 0 ? "text-red-500" : "text-green-600"
                )}>
                  {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  transaction.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                )}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
