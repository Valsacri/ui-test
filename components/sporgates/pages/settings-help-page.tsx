"use client"

import { useState, useMemo } from "react"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
  Send,
  HelpCircle,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsHelpPageProps {
  onBack: () => void
}

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  // Account
  { category: "Account", question: "How do I create an account?", answer: "Tap 'Sign Up' on the welcome screen, enter your email and password, then follow the onboarding steps to pick your sports and set goals." },
  { category: "Account", question: "How do I reset my password?", answer: "Use the 'Forgot Password' option on the sign-in screen. We'll send a reset link to your registered email address." },
  { category: "Account", question: "Can I change my username?", answer: "Go to Settings → Edit Profile and tap on your username to change it. Usernames must be unique." },
  // Booking
  { category: "Booking", question: "How do I book a facility?", answer: "Open any facility from the Explore page, choose your preferred date and time slot, then tap 'Book Now' to confirm." },
  { category: "Booking", question: "Can I cancel a booking?", answer: "Yes, go to your bookings in the Activity page and tap the booking you want to cancel. Free cancellation is available up to 24 hours before the start time." },
  { category: "Booking", question: "How do I reschedule an activity?", answer: "Open the activity from your profile or the Activities page, tap 'Reschedule', and choose a new time slot." },
  // Payments
  { category: "Payments", question: "Where can I view my wallet?", answer: "Go to Settings → Wallet & Transactions to view your balance, add funds, and see your full transaction history." },
  { category: "Payments", question: "What payment methods are supported?", answer: "We accept Visa, Mastercard, PayPal, and Apple Pay. You can manage your payment methods in Settings → Payment Methods." },
  { category: "Payments", question: "How do refunds work?", answer: "Refunds for cancelled bookings are credited to your Sporgates wallet within 24 hours. Wallet-to-bank withdrawals take 3-5 business days." },
  // General
  { category: "General", question: "How do I join a squad?", answer: "Go to the Community page, tap the Squads or Discover tab, find a squad you like, and tap 'Join'. Some squads require captain approval." },
  { category: "General", question: "How do I contact support?", answer: "Use the contact form below, email us at support@sporgates.com, or call our helpline during business hours." },
  { category: "General", question: "Is the app available on iOS and Android?", answer: "Yes! Sporgates is available on both the App Store and Google Play Store, as well as on the web." },
]

const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))]

const subjects = [
  "General Inquiry",
  "Account Issues",
  "Booking Problem",
  "Payment / Refund",
  "Bug Report",
  "Feature Request",
  "Other",
]

export function SettingsHelpPage({ onBack }: SettingsHelpPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Contact form
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formSubject, setFormSubject] = useState(subjects[0])
  const [formMessage, setFormMessage] = useState("")
  const [formSent, setFormSent] = useState(false)

  const filteredFaqs = useMemo(() => {
    let list = faqs
    if (activeCategory !== "All") list = list.filter((f) => f.category === activeCategory)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      )
    }
    return list
  }, [searchQuery, activeCategory])

  const handleSubmit = () => {
    setFormSent(true)
    setFormName("")
    setFormEmail("")
    setFormSubject(subjects[0])
    setFormMessage("")
    setTimeout(() => setFormSent(false), 4000)
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
          <p className="text-sm text-muted-foreground">Find answers or get in touch</p>
        </div>
      </div>

      {/* ===== FAQ SECTION ===== */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Frequently Asked Questions</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="h-10 w-full rounded-full border border-border bg-muted pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                activeCategory === cat
                  ? "gradient-primary text-white shadow-md"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="space-y-2">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <HelpCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No results</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = expandedId === idx
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : idx)}
                  className="w-full rounded-xl border border-border bg-card p-4 text-left transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                      {isOpen && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                  {!isOpen && (
                    <span className="mt-1.5 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {faq.category}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </section>

      {/* ===== CONTACT INFO CARDS ===== */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Contact Us</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: "support@sporgates.com", color: "text-blue-500" },
            { icon: Phone, label: "Phone", value: "+1 (800) 555-0199", color: "text-emerald-500" },
            { icon: MessageCircle, label: "Live Chat", value: "Available 9am – 6pm EST", color: "text-violet-500" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-muted", item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Send a Message</h2>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Your name"
              className="h-10 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">Subject</label>
            <select
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">Message</label>
            <textarea
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              placeholder="Describe your issue or question..."
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formName || !formEmail || !formMessage}
            className="gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Send Message
          </button>

          {formSent && (
            <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
              ✓ Message sent! We'll get back to you within 24 hours.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
