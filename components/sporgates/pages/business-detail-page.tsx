"use client"

import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  CalendarDays,
  BadgeCheck,
  Share2,
  Heart,
  MessageCircle,
  Globe,
  Phone,
  Mail,
} from "lucide-react"
import { businessesService, activitiesService, servicesService } from "@/lib/services"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface BusinessDetailPageProps {
  businessId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

const tabs = ["Overview", "Activities", "Services", "Reviews"]

const reviewsData = [
  { id: "1", author: "Jordan R.", avatar: "JR", rating: 5, date: "Feb 5, 2026", comment: "Excellent facilities and great staff. The basketball courts are top-notch and well-maintained." },
  { id: "2", author: "Emily P.", avatar: "EP", rating: 4, date: "Jan 28, 2026", comment: "Love the variety of activities. The swimming pool is amazing. Would like extended hours on weekends." },
  { id: "3", author: "David K.", avatar: "DK", rating: 5, date: "Jan 20, 2026", comment: "Best sports complex in NYC. Clean, modern equipment and friendly community." },
  { id: "4", author: "Lisa C.", avatar: "LC", rating: 4, date: "Jan 15, 2026", comment: "Great experience overall. The yoga studio is peaceful and the instructors are knowledgeable." },
]

export function BusinessDetailPage({ businessId, onNavigate }: BusinessDetailPageProps) {
  const [business, setBusiness] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Overview")
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [businessData, activitiesData, servicesData] = await Promise.all([
          businessesService.getById(businessId),
          activitiesService.getAll({ organizerId: businessId }),
          servicesService.getAll({ providerId: businessId })
        ])
        setBusiness(businessData)

        if (Array.isArray(activitiesData)) {
          const mappedActivities = activitiesData.map((a: any) => ({
            id: a.id,
            title: a.name,
            sport: a.sportId || "Sport",
            date: new Date(a.startDateTime).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
            time: `${new Date(a.startDateTime).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}`,
            location: a.location || a.city || "TBD",
            price: a.pricePerPerson || 0,
            currency: "USD",
            spots: (a.maxParticipants || 0) - (a.currentParticipants || 0),
            totalSpots: a.maxParticipants || 0,
            image: a.image || "/images/sports-placeholder.jpg", // Fallback
            rating: a.rating || 0,
            reviews: a.reviewCount || 0,
            organizer: a.organizerName || "Organizer",
            organizerAvatar: businessData.avatar || "",
            tags: a.tags || []
          }))
          setActivities(mappedActivities)
        }

        if (Array.isArray(servicesData)) {
          const mappedServices = servicesData.map((s: any) => ({
            id: s.id,
            name: s.name,
            provider: s.providerName || "Provider",
            providerAvatar: s.providerAvatar || businessData.avatar,
            duration: s.duration || "1h",
            price: s.price || 0,
            currency: s.currency || "USD",
            rating: s.rating || 0,
            reviews: s.reviews || 0,
            image: s.image,
            category: s.category || "Service",
            verified: s.verified || false
          }))
          setServices(mappedServices)
        }
      } catch (error) {
        console.error("Failed to fetch business details", error)
      } finally {
        setLoading(false)
      }
    }
    if (businessId) fetchData()
  }, [businessId])

  const relatedActivities = activities.slice(0, 3)
  const relatedServices = services.slice(0, 2)

  const businessDisplay = business ? {
    ...business,
    image: business.cover,
    location: business.city && business.state ? `${business.city}, ${business.state}` : business.address || "Location unavailable",
    rating: 5.0,
    reviews: 0,
    followers: 0,
    activities: activities.length,
    verified: !!business.verifiedAt,
    type: business.type || "Business"
  } : null

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!businessDisplay) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-bold">Business not found</h2>
        <button onClick={() => onNavigate("businesses")} className="text-primary hover:underline">
          Back to Businesses
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate("businesses")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Businesses
      </button>

      {/* Hero Image */}
      <div className="relative h-56 overflow-hidden rounded-2xl md:h-72">
        <img
          src={businessDisplay.image || "/placeholder.svg"}
          alt={businessDisplay.name}
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Heart className="h-5 w-5 text-foreground" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{businessDisplay.name}</h1>
            {businessDisplay.verified && <BadgeCheck className="h-6 w-6 text-white" />}
          </div>
          <p className="text-sm text-white/80">{businessDisplay.type}</p>
        </div>
      </div>

      {/* Business Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-bold text-foreground">{businessDisplay.rating}</span>
            <span className="text-xs text-muted-foreground">({businessDisplay.reviews} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {businessDisplay.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {businessDisplay.followers.toLocaleString()} followers
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {businessDisplay.activities} activities
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFollowing((p) => !p)}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-semibold transition-all",
              following
                ? "border border-primary bg-primary/10 text-primary"
                : "gradient-primary text-white shadow-md"
            )}
          >
            {following ? "Following" : "Follow"}
          </button>
          <button
            type="button"
            className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            title="Message"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* About */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">About</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {businessDisplay.name} is a premier {businessDisplay.type.toLowerCase()} located in {businessDisplay.location}.
              We offer world-class facilities and a vibrant community of sports enthusiasts. Our mission
              is to make sports accessible, fun, and social for everyone in the community.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <Globe className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Website</p>
                  <p className="text-xs font-medium text-foreground">
                    {businessDisplay.website || `www.${businessDisplay.name.toLowerCase().replace(/\s/g, "")}.com`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Phone</p>
                  <p className="text-xs font-medium text-foreground">
                    {businessDisplay.phone || `(212) 555-0${businessDisplay.id.slice(0, 2)}42`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Email</p>
                  <p className="text-xs font-medium text-foreground">
                    {businessDisplay.email || `info@${businessDisplay.name.toLowerCase().replace(/\s/g, "")}.com`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{businessDisplay.activities}</p>
              <p className="text-[11px] text-muted-foreground">Active Events</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">{businessDisplay.followers.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">Followers</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{businessDisplay.rating}</p>
              <p className="text-[11px] text-muted-foreground">Avg Rating</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">{businessDisplay.reviews}</p>
              <p className="text-[11px] text-muted-foreground">Total Reviews</p>
            </div>
          </div>

          {/* Featured Activities */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-foreground">Featured Activities</h3>
            {relatedActivities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onClick={() => onNavigate("activity-detail", activity.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
                No activities available.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Organizer Portfolio</h3>
                <p className="text-xs text-muted-foreground">Showcase past event performance</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("organizer-portfolio", businessId)}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Activities" && (
        <div className="animate-fade-in">
          {activities.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onClick={() => onNavigate("activity-detail", activity.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <p>No activities scheduled.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Services" && (
        <div className="animate-fade-in">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => onNavigate("service-detail", service.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <p>No services offered.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Reviews" && (
        <div className="space-y-4 animate-fade-in">
          {/* Rating Summary */}
          <div className="flex items-center gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{businessDisplay.rating}</p>
              <div className="mt-1 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(businessDisplay.rating)
                        ? "fill-secondary text-secondary"
                        : "text-border"
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{businessDisplay.reviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = rating === 5 ? 65 : rating === 4 ? 25 : rating === 3 ? 7 : rating === 2 ? 2 : 1
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{rating}</span>
                    <Star className="h-3 w-3 fill-secondary text-secondary" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-secondary h-full rounded-full"
                        style={{ width: `${count}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reviews List */}
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.author}</p>
                    <p className="text-[10px] text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= review.rating ? "fill-secondary text-secondary" : "text-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
