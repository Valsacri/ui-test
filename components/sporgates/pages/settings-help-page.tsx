"use client"

interface SettingsHelpPageProps {
  onBack: () => void
}

const faqs = [
  { question: "How do I book a facility?", answer: "Open a facility, choose a date, and request a booking." },
  { question: "How do I reset my password?", answer: "Use the Forgot Password option on the sign-in screen." },
  { question: "Where can I view my wallet?", answer: "Go to Settings and open Wallet & Transactions." },
]

export function SettingsHelpPage({ onBack }: SettingsHelpPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground">Frequently asked questions</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-xl bg-muted p-4">
            <p className="text-sm font-semibold text-foreground">{faq.question}</p>
            <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
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
