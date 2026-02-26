"use client"

import { useMemo, useState } from "react"
import useSWR, { mutate } from "swr"
import { Search, Briefcase, Plus } from "lucide-react"
import { jobsService, businessesService } from "@/lib/services"
import { fetcher } from "@/lib/fetcher"
import type { PageRoute } from "@/lib/navigation"
import { CreateJobOfferModal } from "@/components/sporgates/business/create-job-offer-modal"
import { JobCard } from "@/components/sporgates/cards/job-card"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { LoadingGrid, LoadingActivityCard } from "@/components/sporgates/ux/loading-cards"
import { ConfirmDialog } from "@/components/sporgates/ux/confirm-dialog"
import { toast } from "sonner"

interface JobsPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
  isBusinessMode?: boolean
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
  createdAt?: string | number[] // LocalDateTime can be serialized as array or string
}

function formatPostedDate(createdAt: string | number[] | undefined): string {
  if (!createdAt) return "recently"

  let date: Date | null = null
  if (Array.isArray(createdAt)) {
    // Java LocalDateTime serialized as array: [year, month, day, hour, minute, second?]
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

export function JobsPage({ onNavigate, isBusinessMode = false, activeBusinessId }: JobsPageProps) {
  const [query, setQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editJob, setEditJob] = useState<JobDto | null>(null)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)

  const { data: jobList = [], error, isLoading, mutate: mutateJobs } = useSWR<JobDto[]>('/v1/jobs', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const { data: activeBusiness } = useSWR<any>(
    activeBusinessId ? `/v1/businesses/${activeBusinessId}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  const activeBusinessMapped = useMemo(() => {
    if (!activeBusiness) return null
    return {
      id: activeBusiness.id,
      name: activeBusiness.name,
      logo: activeBusiness.avatar || activeBusiness.logo,
    }
  }, [activeBusiness])

  const filteredJobs = useMemo(() => {
    // In business mode, filter to show only jobs created by the active business
    let jobs = jobList
    if (isBusinessMode && activeBusinessId) {
      jobs = jobList.filter((job) => job.companyId === activeBusinessId)
    }

    // Apply search query filter
    const q = query.trim().toLowerCase()
    if (!q) return jobs
    return jobs.filter((job) =>
      [job.title, job.companyName, job.location, job.type].some((value) =>
        value?.toLowerCase().includes(q)
      )
    )
  }, [jobList, query, isBusinessMode, activeBusinessId])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground">Open roles across sports businesses and teams</p>
        </div>
        {isBusinessMode && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Job
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search roles, companies, locations..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {isLoading ? (
        <LoadingGrid className="md:grid-cols-2">
          <LoadingActivityCard />
        </LoadingGrid>
      ) : error ? (
        <ErrorState
          title="Couldn't load jobs"
          message="There was an error retrieving the latest job opportunities."
          onRetry={() => mutateJobs()}
        />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description={query ? "Try adjusting your search query" : "No job listings available at the moment"}
          action={
            query
              ? {
                label: "Clear Search",
                onClick: () => setQuery(""),
                variant: "secondary",
              }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job) => {
            const isOwnJob = isBusinessMode && activeBusinessMapped && job.companyId === activeBusinessMapped.id
            return (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.companyName}
                type={job.type}
                location={job.location}
                salary={job.salary || "Competitive"}
                description={job.description || ""}
                posted={`Posted ${formatPostedDate(job.createdAt)}`}
                remote={job.location?.toLowerCase().includes("remote") || false}
                onClick={() => onNavigate(isBusinessMode ? "business-job-detail" : "job-detail", job.id)}
                showActions={!!isOwnJob}
                logo={job.logo}
                onEdit={isOwnJob ? async () => {
                  try {
                    // Fetch full job details to ensure we have all fields including requirements
                    const fullJob = await jobsService.getById(job.id)
                    setEditJob(fullJob)
                  } catch (error) {
                    console.error("Failed to fetch job details:", error)
                    // Fallback to using the job from the list
                    setEditJob(job)
                  }
                } : undefined}
                onDelete={isOwnJob ? () => setDeleteJobId(job.id) : undefined}
              />
            )
          })}
        </div>
      )}

      <CreateJobOfferModal
        isOpen={isCreateModalOpen || editJob !== null}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditJob(null)
        }}
        editJob={editJob ? {
          id: editJob.id,
          title: editJob.title,
          type: editJob.type,
          location: editJob.location,
          salary: editJob.salary || "",
          description: editJob.description || "",
          requirements: Array.isArray(editJob.requirements) ? editJob.requirements : [],
        } : null}
        onCreate={async (job) => {
          try {
            if (!activeBusinessMapped) {
              console.error("No active business selected")
              return
            }

            // Format location based on locationType
            let locationValue = job.location
            if (!locationValue && job.locationType) {
              if (job.locationType === "Remote") {
                locationValue = "Remote"
              } else if (job.locationType === "Hybrid") {
                locationValue = "Hybrid"
              } else {
                locationValue = activeBusinessMapped.name || "On-site"
              }
            }

            // Generate logo initials from business name
            const logoInitials = activeBusinessMapped.name
              ? activeBusinessMapped.name
                .split(" ")
                .map((word: string) => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
              : "SB"

            if (editJob) {
              // Update existing job
              await jobsService.update(editJob.id, {
                title: job.title,
                companyName: activeBusinessMapped.name,
                companyId: activeBusinessMapped.id,
                location: locationValue || "On-site",
                type: job.type,
                salary: job.salary || "Competitive",
                description: job.description || "New opening",
                requirements: job.requirements || [],
                logo: activeBusinessMapped.logo || logoInitials,
              })
              await mutateJobs()
              setEditJob(null)
            } else {
              // Create new job
              await jobsService.create({
                title: job.title,
                companyName: activeBusinessMapped.name,
                companyId: activeBusinessMapped.id,
                location: locationValue || "On-site",
                type: job.type,
                salary: job.salary || "Competitive",
                description: job.description || "New opening",
                requirements: job.requirements || [],
                logo: activeBusinessMapped.logo || logoInitials,
              })
              await mutateJobs()
              setIsCreateModalOpen(false)
            }
          } catch (error) {
            console.error(`Failed to ${editJob ? "update" : "create"} job:`, error)
            toast.error(`Failed to ${editJob ? "update" : "create"} job. Please try again.`)
          }
        }}
      />

      <ConfirmDialog
        open={deleteJobId !== null}
        onOpenChange={(open) => !open && setDeleteJobId(null)}
        title="Delete Job"
        description="Are you sure you want to delete this job listing? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (!deleteJobId) return
          try {
            await jobsService.delete(deleteJobId)
            await mutateJobs()
            setDeleteJobId(null)
            toast.success("Job deleted successfully")
          } catch (error) {
            console.error("Failed to delete job:", error)
            toast.error("Failed to delete job. Please try again.")
          }
        }}
      />
    </div>
  )
}
