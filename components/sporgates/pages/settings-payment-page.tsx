"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Plus, MoreHorizontal, Trash2, Star, Shield } from "lucide-react"
import { paymentMethods } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface SettingsPaymentPageProps {
  onBack: () => void
}

const cardColors: Record<string, string> = {
  visa: "from-[#003C66] to-[#005A99]",
  mastercard: "from-[#FC8936] to-[#FFA05C]",
  paypal: "from-[#003C66] to-[#FC8936]",
}

export function SettingsPaymentPage({ onBack }: SettingsPaymentPageProps) {
  const [showAddCard, setShowAddCard] = useState(false)

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-sm text-muted-foreground">Manage your saved payment methods</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddCard((p) => !p)}
          className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </button>
      </div>

      {/* Payment Cards */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* Card Visual */}
            <div className={cn("relative p-5 text-white bg-gradient-to-br", cardColors[method.type] || cardColors.visa)}>
              <div className="absolute right-4 top-4">
                {method.isDefault && (
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm">
                    Default
                  </span>
                )}
              </div>
              <CreditCard className="mb-4 h-8 w-8 text-white/80" />
              <p className="mb-1 font-mono text-lg tracking-wider">
                {"•••• •••• ••••"} {method.last4}
              </p>
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="uppercase">{method.type}</span>
                {method.expiry && <span>Expires {method.expiry}</span>}
                {method.email && <span>{method.email}</span>}
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span>Secure payment method</span>
              </div>
              <div className="flex items-center gap-1">
                {!method.isDefault && (
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <Star className="h-3 w-3" />
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Card Form */}
      {showAddCard && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-in-up">
          <h3 className="mb-4 text-base font-bold text-foreground">Add New Card</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1 h-11 w-full rounded-full border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
              >
                Save Card
              </button>
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="flex items-start gap-3 rounded-2xl bg-muted p-4">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold text-foreground">Your payments are secure</p>
          <p className="text-xs text-muted-foreground">
            All payment information is encrypted and securely stored. We never store your full card number.
          </p>
        </div>
      </div>
    </div>
  )
}
