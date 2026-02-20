"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Wifi, Building2, Check, Users, Mail, Phone, FileText, Calendar } from "lucide-react"
import { DetailPageSkeleton, PersonCardSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { jobsService } from "@/lib/services"
import type { PageRoute } from "@/lib/navigation"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { cn } from "@/lib/utils"

interface BusinessJobDetailPageProps {
  jobId: string
  onNavigate: (page: PageRoute, detailId?: string) => void
  activeBusinessId?: string | null
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

interface Applicant {
  id: string
  name: string
  email: string
  phone?: string
  appliedAt: string
  resume?: string
  coverLetter?: string
  status?: "pending" | "reviewed" | "shortlisted" | "rejected"
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Unknown"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
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

export function BusinessJobDetailPage({ jobId, onNavigate, activeBusinessId }: BusinessJobDetailPageProps) {
  const [job, setJob] = useState<JobDto | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "applicants">("overview")

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    jobsService
      .getById(jobId)
      .then((data: JobDto) => {
        if (!cancelled) {
          setJob(data)
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load job details.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [jobId])

  useEffect(() => {
    if (activeTab === "applicants" && jobId) {
      // TODO: Replace with actual API call when backend is ready
      // For now, using mock data
      setIsLoadingApplicants(true)
      setTimeout(() => {
        // Mock applicants data - replace with actual API call
        setApplicants([
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            appliedAt: new Date().toISOString(),
            resume: "resume.pdf",
            coverLetter: "I am very interested in this position...",
            status: "pending"
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1 (555) 987-6543",
            appliedAt: new Date(Date.now() - 86400000).toISOString(),
            resume: "jane_resume.pdf",
            coverLetter: "With my experience in...",
            status: "reviewed"
          }
        ])
        setIsLoadingApplicants(false)
      }, 500)
    }
  }, [activeTab, jobId])

  if (isLoading) {
    return <DetailPageSkeleton />
  }

  if (error || !job) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <button
          type="button"
          onClick={() => onNavigate("business-jobs")}
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

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "applicants" as const, label: `Applicants (${applicants.length})` }
  ]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("business-jobs")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

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

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab.key
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
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
      )}

      {activeTab === "applicants" && (
        <div className="space-y-4 animate-fade-in">
          {isLoadingApplicants ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          ) : applicants.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No applicants yet</h3>
                <p className="text-sm text-muted-foreground">
                  Applications for this job will appear here once candidates start applying.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{applicant.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{applicant.email}</span>
                          </div>
                          {applicant.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{applicant.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {formatDate(applicant.appliedAt)}</span>
                          </div>
                        </div>
                      </div>
                      {applicant.coverLetter && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Cover Letter</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{applicant.coverLetter}</p>
                        </div>
                      )}
                      {applicant.resume && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-primary hover:underline cursor-pointer">{applicant.resume}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {applicant.status && (
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            applicant.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : applicant.status === "reviewed"
                                ? "bg-blue-100 text-blue-700"
                                : applicant.status === "shortlisted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                          )}
                        >
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </span>
                      )}
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => {
                          // TODO: Implement view full application
                          console.log("View application:", applicant.id)
                        }}
                      >
                        View Full Application
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
