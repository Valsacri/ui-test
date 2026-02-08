"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, DollarSign, MapPin, Clock, Wifi } from "lucide-react"

interface JobCardProps {
  id: string
  title: string
  company: string
  type: string
  location: string
  salary: string
  description: string
  posted: string
  remote: boolean
  onClick: () => void
}

export function JobCard({
  title,
  company,
  type,
  location,
  salary,
  description,
  posted,
  remote,
  onClick,
}: JobCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => event.key === "Enter" && onClick()}
      className="cursor-pointer border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-4 w-4 text-secondary" />
              <span className="font-medium text-foreground">{company}</span>
            </div>
          </div>
          <Badge className="bg-primary text-primary-foreground" variant="secondary">
            {type}
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {remote ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Remote</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">{location}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-secondary" />
            <span className="font-medium text-foreground">{salary}</span>
          </div>
        </div>

        <div className="border-t border-border pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {posted}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
