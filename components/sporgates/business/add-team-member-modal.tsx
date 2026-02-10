"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddTeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTeamMemberModal({ isOpen, onClose }: AddTeamMemberModalProps) {
  const [role, setRole] = useState("Staff")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogTitle className="sr-only">Add Team Member</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Add Team Member</p>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
            <input
              type="text"
              placeholder="Jordan Rivera"
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="jordan@email.com"
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Phone (optional)</label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
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
              onClick={onClose}
              className="gradient-primary flex-1 rounded-xl py-2 text-xs font-semibold text-white"
            >
              Add Member
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
