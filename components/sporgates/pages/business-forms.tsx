"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Upload,
  TrendingUp,
  BarChart3,
  Search,
  MoreHorizontal,
  Mail,
  QrCode,
  CheckCircle,
  XCircle,
  UserPlus,
  Shield,
  Star,
  Building2,
  Megaphone,
  Target,
  ImageIcon,
  Package,
  Edit3,
  Trash2,
  Eye,
  BadgeCheck,
} from "lucide-react"
import { sports, activities, businessResources, businessPartners, athletes, businessDashboardData } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface BusinessFormPageProps {
  onNavigate: (page: PageRoute) => void
}

// ==================== CreateActivity ====================
export function CreateActivityPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    type: "event",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: 10,
    price: 0,
    description: "",
    sponsorship: false,
    sponsorBudget: 0,
  })

  const estimatedReach = formData.capacity * 12
  const estimatedRevenue = formData.capacity * formData.price

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-activities")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Activity</h1>
          <p className="text-sm text-muted-foreground">Set up a new sports activity or event</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Activity Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 5v5 Basketball Pickup Game"
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Sport</label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select sport</option>
                    {sports.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  >
                    <option value="event">Event</option>
                    <option value="session">Session</option>
                    <option value="program">Program</option>
                    <option value="league">League</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your activity..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Cover Image</label>
                <div className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40">
                  <div className="text-center">
                    <Upload className="mx-auto mb-1 h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to upload image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Schedule & Location</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5" /> Start
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5" /> End
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Chelsea Piers, NYC"
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Capacity & Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Users className="h-3.5 w-3.5" /> Max Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <DollarSign className="h-3.5 w-3.5" /> Price per person
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Sponsorship Settings</h3>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, sponsorship: !formData.sponsorship })}
                className={`relative h-6 w-11 rounded-full transition-colors ${formData.sponsorship ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${formData.sponsorship ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            {formData.sponsorship && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-foreground">Sponsor Budget ($)</label>
                <input
                  type="number"
                  value={formData.sponsorBudget}
                  onChange={(e) => setFormData({ ...formData, sponsorBudget: parseInt(e.target.value) || 0 })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onNavigate("business-activities")}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onNavigate("business-activities")}
              className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Create Activity
            </button>
          </div>
        </div>

        {/* Live Impact Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Live Impact Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{estimatedReach.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Estimated Reach</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                  <DollarSign className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">${estimatedRevenue.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Estimated Revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formData.capacity}</p>
                  <p className="text-[10px] text-muted-foreground">Max Participants</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Tips</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Add a compelling cover image to attract more participants</li>
              <li>Set a competitive price based on similar activities in your area</li>
              <li>Enable sponsorship to boost your reach and visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== CreateCampaign ====================
export function CreateCampaignPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    goal: "awareness",
    budget: 300,
    startDate: "",
    endDate: "",
    targetAudience: "all",
    description: "",
  })

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-campaigns")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Campaign</h1>
          <p className="text-sm text-muted-foreground">Launch a marketing campaign</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Campaign Details</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Campaign Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Sports Fest"
                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Campaign Goal</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "awareness", label: "Awareness", icon: Eye },
                  { value: "bookings", label: "Bookings", icon: Calendar },
                  { value: "engagement", label: "Engagement", icon: Users },
                ].map((goal) => (
                  <button
                    type="button"
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                      formData.goal === goal.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <goal.icon className={cn("h-5 w-5", formData.goal === goal.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-semibold", formData.goal === goal.value ? "text-primary" : "text-foreground")}>
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your campaign objectives..."
                rows={3}
                className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Budget & Schedule</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="gradient-secondary h-full rounded-full" style={{ width: `${Math.min((formData.budget / 1000) * 100, 100)}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Estimated reach: {(formData.budget * 10).toLocaleString()} people</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Target Audience</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { value: "all", label: "Everyone" },
              { value: "athletes", label: "Athletes" },
              { value: "beginners", label: "Beginners" },
              { value: "local", label: "Local Area" },
            ].map((audience) => (
              <button
                type="button"
                key={audience.value}
                onClick={() => setFormData({ ...formData, targetAudience: audience.value })}
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-xs font-semibold transition-all",
                  formData.targetAudience === audience.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-foreground hover:border-primary/40"
                )}
              >
                {audience.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => onNavigate("business-campaigns")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            Cancel
          </button>
          <button type="button" onClick={() => onNavigate("business-campaigns")} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90">
            Launch Campaign
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== CreateBusiness ====================
export function CreateBusinessPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    location: "",
    phone: "",
    email: "",
    website: "",
  })

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-dashboard")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Business</h1>
          <p className="text-sm text-muted-foreground">Set up your business profile</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Branding</h3>
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40">
              <div className="text-center">
                <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-1 text-[10px] text-muted-foreground">Logo</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex h-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40">
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Cover Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Business Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Business Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chelsea Piers Sports"
                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Business Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              >
                <option value="">Select type</option>
                <option value="gym">Gym & Training</option>
                <option value="sports-complex">Sports Complex</option>
                <option value="academy">Academy</option>
                <option value="wellness">Wellness Center</option>
                <option value="retail">Sports Retail</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell people about your business..."
                rows={3}
                className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-foreground">Contact & Location</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Address</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Street address" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contact@business.com" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Website</label>
              <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://www.yourbusiness.com" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => onNavigate("business-dashboard")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            Cancel
          </button>
          <button type="button" onClick={() => onNavigate("business-dashboard")} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90">
            Create Business
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== AddResource ====================
export function AddResourcePage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({ name: "", type: "court", pricePerHour: 0, capacity: 0, description: "" })

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-resources")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Resource</h1>
          <p className="text-sm text-muted-foreground">Add a new facility resource</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Resource Type</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Court", "Pool", "Studio", "Ring", "Field", "Track", "Gym", "Room"].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setFormData({ ...formData, type: type.toLowerCase() })}
              className={cn(
                "rounded-xl border-2 px-4 py-3 text-xs font-semibold transition-all",
                formData.type === type.toLowerCase() ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/40"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Details</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Resource Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Basketball Court A" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Price per Hour ($)</label>
              <input type="number" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 0 })} className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">Capacity</label>
              <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the resource..." rows={3} className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Photo</label>
            <div className="flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted hover:border-primary/40">
              <div className="text-center">
                <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Upload photo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onNavigate("business-resources")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">Cancel</button>
        <button type="button" onClick={() => onNavigate("business-resources")} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-90">Add Resource</button>
      </div>
    </div>
  )
}

// ==================== AddTeamMember ====================
export function AddTeamMemberPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({ name: "", email: "", role: "trainer", permissions: ["view-bookings"] })

  const roles = [
    { value: "admin", label: "Admin", description: "Full access to all features" },
    { value: "manager", label: "Manager", description: "Manage activities and bookings" },
    { value: "trainer", label: "Trainer", description: "View and manage assigned activities" },
    { value: "instructor", label: "Instructor", description: "View schedule and check in attendees" },
  ]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-team")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Team Member</h1>
          <p className="text-sm text-muted-foreground">Invite someone to your team</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Member Information</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@email.com" className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Role Assignment</h3>
        <div className="space-y-3">
          {roles.map((role) => (
            <button
              type="button"
              key={role.value}
              onClick={() => setFormData({ ...formData, role: role.value })}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all",
                formData.role === role.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", formData.role === role.value ? "bg-primary/10" : "bg-muted")}>
                <Shield className={cn("h-5 w-5", formData.role === role.value ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div>
                <p className={cn("text-sm font-semibold", formData.role === role.value ? "text-primary" : "text-foreground")}>{role.label}</p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onNavigate("business-team")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">Cancel</button>
        <button type="button" onClick={() => onNavigate("business-team")} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-90">Send Invite</button>
      </div>
    </div>
  )
}

// ==================== AddCollaboration ====================
export function AddCollaborationPage({ onNavigate }: BusinessFormPageProps) {
  const [formData, setFormData] = useState({ partnerType: "sponsor", search: "", message: "" })

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-partners")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Collaboration</h1>
          <p className="text-sm text-muted-foreground">Find and propose partnerships</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Partner Type</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "sponsor", label: "Sponsor", icon: DollarSign },
            { value: "athlete", label: "Athlete", icon: Star },
            { value: "business", label: "Business", icon: Building2 },
          ].map((type) => (
            <button
              type="button"
              key={type.value}
              onClick={() => setFormData({ ...formData, partnerType: type.value })}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                formData.partnerType === type.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              )}
            >
              <type.icon className={cn("h-5 w-5", formData.partnerType === type.value ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-xs font-semibold", formData.partnerType === type.value ? "text-primary" : "text-foreground")}>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Find Partner</h3>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={formData.search} onChange={(e) => setFormData({ ...formData, search: e.target.value })} placeholder="Search by name..." className="h-11 w-full rounded-full border border-border bg-muted pl-10 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <div className="space-y-2">
          {businessPartners.filter((p) => formData.partnerType === "sponsor" ? p.type === "Sponsor" : p.type === "Athlete").map((partner) => (
            <div key={partner.id} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">{partner.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{partner.type}{partner.tier ? ` - ${partner.tier}` : ""}{partner.sport ? ` - ${partner.sport}` : ""}</p>
              </div>
              <button type="button" className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary hover:bg-primary/20">Select</button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Proposal Message</h3>
        <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Write your collaboration proposal..." rows={4} className="w-full rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary resize-none" />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => onNavigate("business-partners")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted">Cancel</button>
        <button type="button" onClick={() => onNavigate("business-partners")} className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md hover:opacity-90">Send Proposal</button>
      </div>
    </div>
  )
}

// ==================== BusinessAthletes ====================
export function BusinessAthletesPage({ onNavigate }: BusinessFormPageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Athletes</h1>
          <p className="text-sm text-muted-foreground">Manage influencer and athlete partnerships</p>
        </div>
        <button type="button" onClick={() => onNavigate("add-collaboration")} className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add Athlete
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Users className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{athletes.length}</p>
          <p className="text-[11px] text-muted-foreground">Total Athletes</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <TrendingUp className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">{athletes.reduce((sum, a) => sum + a.collaborations, 0)}</p>
          <p className="text-[11px] text-muted-foreground">Collaborations</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Star className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{(athletes.reduce((sum, a) => sum + a.engagement, 0) / athletes.length).toFixed(1)}%</p>
          <p className="text-[11px] text-muted-foreground">Avg Engagement</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <BarChart3 className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">{(athletes.reduce((sum, a) => sum + a.followers, 0) / 1000).toFixed(1)}K</p>
          <p className="text-[11px] text-muted-foreground">Total Reach</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search athletes..." className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" />
      </div>

      <div className="space-y-3">
        {athletes.map((athlete) => (
          <div key={athlete.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50">
            <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl text-xs font-bold text-white">{athlete.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground">{athlete.name}</p>
                <BadgeCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{athlete.sport} - {athlete.ranking}</p>
            </div>
            <div className="hidden items-center gap-6 text-xs md:flex">
              <div className="text-center">
                <p className="font-semibold text-foreground">{athlete.followers.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{athlete.engagement}%</p>
                <p className="text-[10px] text-muted-foreground">Engagement</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{athlete.collaborations}</p>
                <p className="text-[10px] text-muted-foreground">Collabs</p>
              </div>
            </div>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
              athlete.status === "active" ? "bg-green-100 text-green-700" : athlete.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-muted text-muted-foreground"
            )}>{athlete.status}</span>
            <button type="button" className="rounded-full p-2 hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== ManageResources ====================
export function ManageResourcesPage({ onNavigate }: BusinessFormPageProps) {
  const [resources, setResources] = useState(
    businessResources.map((r) => ({ ...r, pricePerHour: Math.floor(Math.random() * 50) + 30, available: r.status === "available" }))
  )

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Resources</h1>
          <p className="text-sm text-muted-foreground">Edit pricing and availability</p>
        </div>
        <button type="button" onClick={() => onNavigate("add-resource")} className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90">
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Resource</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Price/hr</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Revenue</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={resource.image} alt={resource.name} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                    <span className="text-xs font-semibold text-foreground">{resource.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{resource.type}</td>
                <td className="px-5 py-3 text-xs font-semibold text-foreground">${resource.pricePerHour}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                    resource.status === "available" ? "bg-green-100 text-green-700" : resource.status === "maintenance" ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                  )}>{resource.status}</span>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-foreground">${resource.revenue}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <button type="button" className="rounded-full p-1 hover:bg-muted"><Edit3 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button type="button" className="rounded-full p-1 hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ==================== ManageCustomers ====================
export function ManageCustomersPage({ onNavigate }: BusinessFormPageProps) {
  const customers = [
    { name: "Jordan Rivera", email: "jordan@email.com", bookings: 12, spent: 340, avatar: "JR", notes: "VIP member, prefers morning sessions", lastVisit: "Feb 7, 2026" },
    { name: "Emily Park", email: "emily@email.com", bookings: 8, spent: 220, avatar: "EP", notes: "Interested in swimming programs", lastVisit: "Feb 5, 2026" },
    { name: "David Kim", email: "david@email.com", bookings: 15, spent: 450, avatar: "DK", notes: "Team lead for corporate bookings", lastVisit: "Feb 6, 2026" },
    { name: "Lisa Chen", email: "lisa@email.com", bookings: 5, spent: 125, avatar: "LC", notes: "New member, needs orientation", lastVisit: "Jan 28, 2026" },
    { name: "Mark Brown", email: "mark@email.com", bookings: 3, spent: 75, avatar: "MB", notes: "", lastVisit: "Jan 15, 2026" },
  ]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Customers</h1>
        <p className="text-sm text-muted-foreground">CRM-style customer management with notes</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search customers..." className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" />
      </div>

      <div className="space-y-3">
        {customers.map((customer) => (
          <div key={customer.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white">{customer.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
              <div className="hidden items-center gap-4 text-xs md:flex">
                <div className="text-center">
                  <p className="font-semibold text-foreground">{customer.bookings}</p>
                  <p className="text-[10px] text-muted-foreground">Bookings</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">${customer.spent}</p>
                  <p className="text-[10px] text-muted-foreground">Spent</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button type="button" className="rounded-full p-2 hover:bg-muted"><Mail className="h-4 w-4 text-muted-foreground" /></button>
                <button type="button" className="rounded-full p-2 hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            </div>
            {customer.notes && (
              <div className="mt-3 rounded-xl bg-muted p-3">
                <p className="text-[10px] font-semibold text-muted-foreground">Notes</p>
                <p className="text-xs text-foreground">{customer.notes}</p>
              </div>
            )}
            <p className="mt-2 text-[10px] text-muted-foreground">Last visit: {customer.lastVisit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== TeamManagement ====================
export function TeamManagementPage({ onNavigate }: BusinessFormPageProps) {
  const teamMembers = businessDashboardData.teamMembers.map((m) => ({
    ...m,
    permissions: m.role === "Head Coach" ? ["all"] : m.role === "Manager" ? ["bookings", "activities", "reports"] : ["bookings", "activities"],
  }))

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground">Manage permissions and roles</p>
        </div>
        <button type="button" onClick={() => onNavigate("add-team-member")} className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90">
          <UserPlus className="h-4 w-4" />
          Invite
        </button>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white">{member.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold", member.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>{member.status}</span>
              <button type="button" className="rounded-full p-2 hover:bg-muted"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="mt-3">
              <p className="mb-2 text-[10px] font-semibold text-muted-foreground">Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {member.permissions.map((perm) => (
                  <span key={perm} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">{perm}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== BusinessProfile ====================
export function BusinessProfilePage({ onNavigate }: BusinessFormPageProps) {
  const data = businessDashboardData

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-primary h-32" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <div className="gradient-secondary flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Chelsea Piers Sports</h1>
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Sports Complex</p>
            </div>
            <button type="button" onClick={() => onNavigate("create-business")} className="hidden rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white md:block">
              Edit Profile
            </button>
          </div>
          <p className="mt-3 text-sm text-foreground">Premier multi-sport complex in NYC offering basketball, swimming, tennis, and more.</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Chelsea, NYC</span>
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-secondary text-secondary" />4.8 (312 reviews)</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />2,450 followers</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-xl font-bold text-primary">${(data.totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-[11px] text-muted-foreground">Revenue</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-xl font-bold text-secondary">{data.totalBookings}</p>
          <p className="text-[11px] text-muted-foreground">Bookings</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-xl font-bold text-primary">{data.activeActivities}</p>
          <p className="text-[11px] text-muted-foreground">Activities</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-xl font-bold text-secondary">{data.teamMembers.length}</p>
          <p className="text-[11px] text-muted-foreground">Team</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Top Activities</h3>
        <div className="space-y-3">
          {data.topActivities.map((activity) => (
            <div key={activity.name} className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{activity.name}</span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{activity.bookings} bookings</span>
                <span className="font-semibold text-primary">${activity.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ==================== AttendanceManagement ====================
export function AttendanceManagementPage({ onNavigate }: BusinessFormPageProps) {
  const attendees = [
    { name: "Jordan Rivera", avatar: "JR", checkedIn: true, time: "5:45 PM" },
    { name: "Emily Park", avatar: "EP", checkedIn: true, time: "5:50 PM" },
    { name: "David Kim", avatar: "DK", checkedIn: false, time: "" },
    { name: "Lisa Chen", avatar: "LC", checkedIn: true, time: "5:55 PM" },
    { name: "Mark Brown", avatar: "MB", checkedIn: false, time: "" },
    { name: "Carlos Rivera", avatar: "CR", checkedIn: true, time: "5:58 PM" },
    { name: "Sarah Lee", avatar: "SL", checkedIn: false, time: "" },
    { name: "Alex Chen", avatar: "AC", checkedIn: true, time: "6:01 PM" },
  ]

  const checkedInCount = attendees.filter((a) => a.checkedIn).length

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onNavigate("business-activities")} className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground">5v5 Basketball Pickup Game - Feb 10, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-primary">{checkedInCount}</p>
          <p className="text-[11px] text-muted-foreground">Checked In</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-secondary">{attendees.length - checkedInCount}</p>
          <p className="text-[11px] text-muted-foreground">Pending</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-foreground">{attendees.length}</p>
          <p className="text-[11px] text-muted-foreground">Total</p>
        </div>
      </div>

      {/* QR Scan */}
      <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <QrCode className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground">QR Code Scanner</h3>
          <p className="mt-1 text-xs text-muted-foreground">Scan attendee QR codes for quick check-in</p>
          <button type="button" className="gradient-primary mt-4 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90">
            Open Scanner
          </button>
        </div>
      </div>

      {/* Attendee List */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-bold text-foreground">Attendees</h3>
        </div>
        <div className="divide-y divide-border">
          {attendees.map((attendee) => (
            <div key={attendee.name} className="flex items-center gap-4 px-5 py-3">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">{attendee.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{attendee.name}</p>
                {attendee.checkedIn && <p className="text-[10px] text-muted-foreground">Checked in at {attendee.time}</p>}
              </div>
              {attendee.checkedIn ? (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-700">
                  <CheckCircle className="h-3 w-3" /> Present
                </span>
              ) : (
                <button type="button" className="rounded-full border border-primary px-3 py-1 text-[10px] font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
                  Check In
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
