"use client"

import { useMemo, useState, useEffect } from "react"
import { Search, Briefcase, Plus } from "lucide-react"
import { jobsService, businessesService } from "@/lib/services"
import type { PageRoute } from "@/lib/navigation"
import { CreateJobOfferModal } from "@/components/sporgates/business/create-job-offer-modal"
import { JobCard } from "@/components/sporgates/cards/job-card"
import { EmptyState } from "@/components/sporgates/ux/empty-state"
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
  const [jobList, setJobList] = useState<JobDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editJob, setEditJob] = useState<JobDto | null>(null)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [activeBusiness, setActiveBusiness] = useState<{ id: string; name: string; logo?: string } | null>(null)

  useEffect(() => {
    setIsLoading(true)
    jobsService.getAll().then((data) => {
      if (Array.isArray(data)) {
        setJobList(data)
      }
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const fetchActiveBusiness = async () => {
      if (activeBusinessId) {
        try {
          const business = await businessesService.getById(activeBusinessId)
          setActiveBusiness({
            id: business.id,
            name: business.name,
            logo: business.avatar || business.logo,
          })
        } catch (error) {
          console.error("Failed to fetch active business:", error)
        }
      }
    }
    fetchActiveBusiness()
  }, [activeBusinessId])

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
            const isOwnJob = isBusinessMode && activeBusiness && job.companyId === activeBusiness.id
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
            if (!activeBusiness) {
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
                locationValue = activeBusiness.name || "On-site"
              }
            }

            // Generate logo initials from business name
            const logoInitials = activeBusiness.name
              ? activeBusiness.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
              : "SB"

            if (editJob) {
              // Update existing job
              const updatedJob = await jobsService.update(editJob.id, {
                title: job.title,
                companyName: activeBusiness.name,
                companyId: activeBusiness.id,
                location: locationValue || "On-site",
                type: job.type,
                salary: job.salary || "Competitive",
                description: job.description || "New opening",
                requirements: job.requirements || [],
                logo: activeBusiness.logo || logoInitials,
              })
              setJobList((prev) => prev.map((j) => (j.id === editJob.id ? updatedJob : j)))
              setEditJob(null)
            } else {
              // Create new job
              const newJob = await jobsService.create({
                title: job.title,
                companyName: activeBusiness.name,
                companyId: activeBusiness.id,
                location: locationValue || "On-site",
                type: job.type,
                salary: job.salary || "Competitive",
                description: job.description || "New opening",
                requirements: job.requirements || [],
                logo: activeBusiness.logo || logoInitials,
              })
              setJobList((prev) => [newJob, ...prev])
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
            setJobList((prev) => prev.filter((j) => j.id !== deleteJobId))
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
