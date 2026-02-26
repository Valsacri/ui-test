"use client"

import { useState } from "react"
import useSWR from "swr"
import { ArrowLeft, MapPin, Clock, DollarSign, Building2, Briefcase, CheckCircle, Calendar, Wifi, Check } from "lucide-react"
import { jobsService } from "@/lib/services"
import type { PageRoute } from "@/lib/navigation"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { DetailPageSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { cn } from "@/lib/utils"

interface JobDetailPageProps {
  jobId: string
  onNavigate: (page: PageRoute, detailId?: string) => void
}

interface JobDto {
  id: string
  title: string
  companyName: string
  companyId?: string
  location: string
  type: string
  salary?: string
  description?: string
  requirements?: string[]
  logo?: string
  createdAt?: string | number[]
}

function formatPostedDate(createdAt: string | number[] | undefined): string {
  if (!createdAt) return "recently"

  let date: Date | null = null
  if (Array.isArray(createdAt)) {
    const [y, m, d, h = 0, min = 0, s = 0] = createdAt as number[]
    date = new Date(y, m - 1, d, h, min, s)
  } else {
    date = new Date(createdAt)
  }

  if (!date || isNaN(date.getTime())) return "recently"

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  }
  const months = Math.floor(diffDays / 30)
  return `${months} ${months === 1 ? "month" : "months"} ago`
}

// Generate initials from company name if no logo
function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function JobDetailPage({ jobId, onNavigate }: JobDetailPageProps) {
  const { data: job, error, isLoading } = useSWR<JobDto>(
    jobId ? `/jobs/${jobId}` : null,
    () => jobsService.getById(jobId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  if (isLoading) {
    return <DetailPageSkeleton />
  }

  if (error || !job) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("jobs")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>
        <EmptyState
          icon={Briefcase}
          title="Job not found"
          description={error || "The job listing you're looking for doesn't exist."}
        />
      </div>
    )
  }

  const isRemote = job.location?.toLowerCase().includes("remote") || false
  const isLogoUrl = job.logo && (job.logo.startsWith("http") || job.logo.startsWith("/"))
  const avatarContent = isLogoUrl ? (
    <img
      src={job.logo?.startsWith("http") ? job.logo : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}${job.logo}`}
      alt={job.companyName}
      className="h-12 w-12 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {job.logo && job.logo.length <= 3 ? job.logo.toUpperCase() : getInitials(job.companyName)}
    </div>
  )

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("jobs")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {avatarContent}
              <div className="flex-1">
                <h1 className="mb-2 text-2xl font-bold text-foreground">{job.title}</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{job.companyName}</span>
                  </div>
                  {job.companyId && (
                    <button
                      type="button"
                      onClick={() => onNavigate("business-detail", job.companyId)}
                      className="text-xs text-primary hover:underline"
                    >
                      View Company
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {job.type}
              </span>
              {isRemote && (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <Wifi className="h-3 w-3" />
                  Remote
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Clock className="h-3 w-3" />
                Posted {formatPostedDate(job.createdAt)}
              </span>
            </div>
          </div>

          {/* Job Details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-foreground">Job Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{job.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="mt-0.5 h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Salary</p>
                  <p className="text-sm font-medium text-foreground">{job.salary || "Competitive"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Job Type</p>
                  <p className="text-sm font-medium text-foreground">{job.type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Apply for this job</h3>
            <button
              type="button"
              className="gradient-primary w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Apply Now
            </button>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              You'll be redirected to apply through the company's application process
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground">Share this job</h3>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
              >
                Copy Link
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
