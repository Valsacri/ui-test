"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, DollarSign, MapPin, Clock, Wifi, MoreVertical, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
  logo?: string
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
  onEdit,
  onDelete,
  showActions = false,
  logo,
}: JobCardProps) {
  // Generate initials from company name if no logo
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Check if logo is a URL (starts with http or /) or just initials/text
  const isLogoUrl = logo && (logo.startsWith("http") || logo.startsWith("/"))

  const avatarContent = isLogoUrl ? (
    <img
      src={logo.startsWith("http") ? logo : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}${logo}`}
      alt={company}
      className="h-6 w-6 rounded-full object-cover"
      loading="lazy"
      onError={(e) => {
        // Fallback to initials if image fails to load
        const target = e.target as HTMLImageElement
        const parent = target.parentElement
        if (parent) {
          target.style.display = "none"
          const fallback = document.createElement("div")
          fallback.className = "flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
          fallback.textContent = getInitials(company)
          parent.appendChild(fallback)
        }
      }}
    />
  ) : (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
      {logo && logo.length <= 3 ? logo.toUpperCase() : getInitials(company)}
    </div>
  )
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on the dropdown menu
    if ((e.target as HTMLElement).closest('[role="menu"]') || (e.target as HTMLElement).closest('button')) {
      return
    }
    onClick()
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(event) => event.key === "Enter" && onClick()}
      className="cursor-pointer border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {avatarContent}
              <span className="font-medium text-foreground">{company}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground" variant="secondary">
              {type}
            </Badge>
            {showActions && (onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg p-1.5 hover:bg-muted transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit() }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); onDelete() }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
