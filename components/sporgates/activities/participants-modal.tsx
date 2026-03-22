"use client"

import Image from "next/image"
import { Loader2 } from "lucide-react"
import useSWR from "swr"
import { activitiesService } from "@/lib/services/activities"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ParticipantsModalProps {
  activityId: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  currentParticipants: number
  maxParticipants: number
}

export function ParticipantsModal({ activityId, isOpen, setIsOpen, currentParticipants, maxParticipants }: ParticipantsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Participants ({currentParticipants}/{maxParticipants})</DialogTitle>
        </DialogHeader>
        <ParticipantsList activityId={activityId} isOpen={isOpen} />
      </DialogContent>
    </Dialog>
  )
}

function ParticipantsList({ activityId, isOpen }: { activityId: string, isOpen: boolean }) {
  const { data: participants, isLoading, error } = useSWR(
    isOpen ? `/v1/activities/${activityId}/participants` : null,
    () => activitiesService.getActivityParticipants(activityId),
    { revalidateOnFocus: false }
  )

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-sm text-destructive">
        Failed to load participants.
      </div>
    )
  }

  if (!participants?.length) {
    return (
      <div className="text-center p-8 text-sm text-muted-foreground">
        No participants yet. Be the first to join!
      </div>
    )
  }

  return (
    <ScrollArea className="max-h-[300px] overflow-auto pr-4">
      <div className="space-y-4 pt-2">
        {participants.map((user: any) => (
          <div key={user.id} className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full gradient-primary text-xs font-bold text-white shadow-sm">
              {user.profilePicture && (user.profilePicture.startsWith("/") || user.profilePicture.startsWith("http")) ? (
                <Image
                  src={user.profilePicture}
                  alt={user.username}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <span>{user.username?.slice(0, 2).toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-muted-foreground mt-1">@{user.username}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
