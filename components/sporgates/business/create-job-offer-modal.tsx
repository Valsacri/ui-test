"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface CreateJobOfferModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (job: {
    title: string
    type: string
    locationType: string
    location: string
    salary: string
    description: string
  }) => void
}

export function CreateJobOfferModal({ isOpen, onClose, onCreate }: CreateJobOfferModalProps) {
  const [jobType, setJobType] = useState("Full-Time")
  const [locationType, setLocationType] = useState("On-site")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    const trimmedTitle = title.trim() || "New Role"
    onCreate({
      title: trimmedTitle,
      type: jobType,
      locationType,
      location: location.trim(),
      salary: salary.trim(),
      description: description.trim(),
    })
    setTitle("")
    setLocation("")
    setSalary("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogTitle className="sr-only">Create Job Offer</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="text-sm font-semibold text-foreground">Create Job Offer</p>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Job Title</label>
            <input
              type="text"
              placeholder="Personal Trainer"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Job Type</label>
              <select
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm outline-none"
              >
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Work Location</label>
              <select
                value={locationType}
                onChange={(event) => setLocationType(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm outline-none"
              >
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Location</label>
            <input
              type="text"
              placeholder="Manhattan, NYC"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Salary / Pay Range</label>
            <input
              type="text"
              placeholder="$45,000 - $65,000"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea
              rows={4}
              placeholder="Describe responsibilities, expectations, and perks"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="gradient-primary flex-1 rounded-xl py-2 text-xs font-semibold text-white"
            >
              Publish Job
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
