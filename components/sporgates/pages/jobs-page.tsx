"use client"

import { useMemo, useState, useEffect } from "react"
import { Search, MapPin, Briefcase, Plus } from "lucide-react"
import { jobs as mockJobs } from "@/lib/mock-data"
import { jobsService } from "@/lib/services"
import type { PageRoute } from "@/lib/navigation"
import { CreateJobOfferModal } from "@/components/sporgates/business/create-job-offer-modal"
import { JobCard } from "@/components/sporgates/cards/job-card"

interface JobsPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function JobsPage({ onNavigate }: JobsPageProps) {
  const [query, setQuery] = useState("")
  const [jobList, setJobList] = useState(mockJobs)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    jobsService.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) setJobList(data)
    }).catch(() => { })
  }, [])

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return jobList
    return jobList.filter((job) =>
      [job.title, job.company, job.location, job.type].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [jobList, query])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground">Open roles across sports businesses and teams</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="gradient-primary flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Post Job
        </button>
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

      <div className="grid gap-4 md:grid-cols-2">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            title={job.title}
            company={job.company}
            type={job.type}
            location={job.location}
            salary={job.salary}
            description={job.description}
            posted={`Posted ${job.posted}`}
            remote={job.location.toLowerCase().includes("remote")}
            onClick={() => onNavigate("jobs", job.id)}
          />
        ))}
      </div>

      <CreateJobOfferModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(job) => {
          const locationValue = job.location || `${job.locationType} role`
          const salaryValue = job.salary || "Competitive"
          setJobList((prev) => [
            {
              id: `job-${Date.now()}`,
              title: job.title,
              company: "Sporgates Business",
              location: locationValue,
              type: job.type,
              salary: salaryValue,
              posted: "just now",
              description: job.description || "New opening",
              requirements: [],
              logo: "SB",
            },
            ...prev,
          ])
        }}
      />
    </div>
  )
}
