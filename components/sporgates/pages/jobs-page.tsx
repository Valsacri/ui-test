"use client"

import { useMemo, useState } from "react"
import { Search, MapPin, Briefcase } from "lucide-react"
import { jobs } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"

interface JobsPageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function JobsPage({ onNavigate }: JobsPageProps) {
  const [query, setQuery] = useState("")
  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return jobs
    return jobs.filter((job) =>
      [job.title, job.company, job.location, job.type].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [query])

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
        <p className="text-sm text-muted-foreground">Open roles across sports businesses and teams</p>
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

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <button
            key={job.id}
            type="button"
            onClick={() => onNavigate("jobs", job.id)}
            className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white">
                {job.logo}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {job.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.salary}
                  </span>
                  <span>Posted {job.posted}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
