"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    requirements: string[]
  }) => void
  editJob?: {
    id: string
    title: string
    type: string
    location: string
    salary: string
    description: string
    requirements: string[]
  } | null
}

export function CreateJobOfferModal({ isOpen, onClose, onCreate, editJob }: CreateJobOfferModalProps) {
  const [jobType, setJobType] = useState("Full-Time")
  const [locationType, setLocationType] = useState("On-site")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState<string[]>([])
  const [requirementInput, setRequirementInput] = useState("")

  // Reset form when modal opens/closes or editJob changes
  useEffect(() => {
    if (isOpen) {
      if (editJob) {
        setTitle(editJob.title || "")
        setJobType(editJob.type || "Full-Time")
        setLocation(editJob.location || "")
        setSalary(editJob.salary || "")
        setDescription(editJob.description || "")
        // Ensure requirements is always an array
        const reqs = Array.isArray(editJob.requirements) ? editJob.requirements : []
        setRequirements(reqs)
        setRequirementInput("")
        // Determine location type from location string
        const loc = (editJob.location || "").toLowerCase()
        if (loc.includes("remote")) {
          setLocationType("Remote")
        } else if (loc.includes("hybrid")) {
          setLocationType("Hybrid")
        } else {
          setLocationType("On-site")
        }
      } else {
        // Reset to defaults for new job
        setTitle("")
        setJobType("Full-Time")
        setLocationType("On-site")
        setLocation("")
        setSalary("")
        setDescription("")
        setRequirements([])
        setRequirementInput("")
      }
    } else {
      // Reset when modal closes
      setRequirementInput("")
    }
  }, [isOpen, editJob])

  const handleAddRequirement = () => {
    const trimmed = requirementInput.trim()
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements([...requirements, trimmed])
      setRequirementInput("")
    }
  }

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      alert("Please enter a job title")
      return
    }

    onCreate({
      title: trimmedTitle,
      type: jobType,
      locationType,
      location: location.trim(),
      salary: salary.trim(),
      description: description.trim(),
      requirements,
    })
    
    // Reset form only if not editing (editing will be reset by useEffect)
    if (!editJob) {
      setTitle("")
      setLocation("")
      setSalary("")
      setDescription("")
      setRequirements([])
      setRequirementInput("")
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogTitle className="sr-only">Create Job Offer</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="text-sm font-semibold text-foreground">{editJob ? "Edit Job Offer" : "Create Job Offer"}</p>
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
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Work Location</label>
              <Select value={locationType} onValueChange={setLocationType}>
                <SelectTrigger className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
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
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Requirements</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                placeholder="e.g., 2+ years experience, certification required"
                value={requirementInput}
                onChange={(event) => setRequirementInput(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddRequirement()
                  }
                }}
                className="flex-1 rounded-xl border border-border bg-muted px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Add
              </button>
            </div>
            {requirements.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {requirements.map((req, index) => (
                  <span
                    key={index}
                    className="group flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                  >
                    {req}
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index)}
                      className="text-primary opacity-70 transition-opacity hover:opacity-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              {editJob ? "Update Job" : "Publish Job"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
