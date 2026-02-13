"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Zap, Trophy, TrendingUp, Target, Users, Calendar } from "lucide-react"
import { activities as mockActivities, facilities as mockFacilities, goals, userProfile, posts as mockPosts, services as mockServices } from "@/lib/mock-data"
import { activitiesService, postsService, servicesService } from "@/lib/services"
import { authService } from "@/lib/services"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { FacilityCard } from "@/components/sporgates/cards/facility-card"
import { PostCard } from "@/components/sporgates/cards/post-card"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import { Stories } from "@/components/sporgates/stories"
import type { PageRoute } from "@/lib/navigation"

interface HomePageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [feedTab, setFeedTab] = useState<"foryou" | "following">("foryou")
  const [activities, setActivities] = useState(mockActivities)
  const [posts, setPosts] = useState(mockPosts)
  const [services, setServices] = useState(mockServices)
  const [facilities] = useState(mockFacilities)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    const userId = currentUser?.id

    activitiesService.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) setActivities(data)
    }).catch(() => { })

    postsService.getAll(undefined, userId).then((data) => {
      if (Array.isArray(data) && data.length > 0) setPosts(data)
    }).catch(() => { })

    servicesService.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) setServices(data)
    }).catch(() => { })
  }, [])

  const displayedPosts = feedTab === "foryou" ? posts.slice(0, 3) : posts.slice(0, 2)

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Hero Banner */}
      <div className="gradient-hero relative overflow-hidden rounded-2xl p-6 text-white shadow-lg md:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-white/5" />
        <div className="relative max-w-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/80">
            Welcome back
          </p>
          <h1 className="mb-2 text-2xl font-bold text-balance md:text-3xl">
            Hey, {userProfile.name.split(" ")[0]}!
          </h1>
          <p className="mb-4 text-sm leading-relaxed text-white/80">
            You have 3 upcoming activities this week. Keep up the momentum!
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("explore")}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#003C66] transition-opacity hover:opacity-90"
            >
              Explore Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("activities")}
              className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Calendar className="h-4 w-4" />
              My Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div>
        <h2 className="mb-3 text-base font-bold text-foreground">Stories</h2>
        <Stories />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Activities Joined",
            value: userProfile.stats.totalActivities,
            icon: Zap,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            label: "Hours Played",
            value: userProfile.stats.hoursPlayed,
            icon: Trophy,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Sports Played",
            value: userProfile.stats.sportsPlayed,
            icon: TrendingUp,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            label: "Avg Rating",
            value: userProfile.stats.avgRating,
            icon: Target,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Goals Progress */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Your Goals</h2>
          <button
            type="button"
            className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {goals.map((goal) => {
            const percentage = (goal.progress / goal.target) * 100
            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {goal.sport}
                  </span>
                  <span className="text-xs text-muted-foreground">{goal.deadline}</span>
                </div>
                <h3 className="mb-2 text-sm font-bold text-foreground">{goal.title}</h3>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">
                    {goal.progress}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="gradient-secondary h-full rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-right text-[10px] font-semibold text-secondary">
                  {Math.round(percentage)}%
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Social Feed */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Community Feed</h2>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">2.4k active now</span>
          </div>
        </div>
        <div className="mb-4 flex gap-2">
          {(["foryou", "following"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setFeedTab(tab)}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${feedTab === tab
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
            >
              {tab === "foryou" ? "For You" : "Following"}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {displayedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Featured Activities */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Featured Activities</h2>
          <button
            type="button"
            onClick={() => onNavigate("activities")}
            className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            See All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.slice(0, 3).map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => onNavigate("activity-detail", activity.id)}
            />
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Popular Services</h2>
          <button
            type="button"
            onClick={() => onNavigate("services")}
            className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            See All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => onNavigate("service-detail", service.id)}
            />
          ))}
        </div>
      </div>

      {/* Top Facilities */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Top Facilities</h2>
          <button
            type="button"
            onClick={() => onNavigate("facilities")}
            className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            See All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {facilities.slice(0, 2).map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onClick={() => onNavigate("facility-detail", facility.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
