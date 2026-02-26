"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface Resource {
  id: string
  name: string
  type: string
  price: number
  category?: string
  image: string
  businessName?: string
}

interface ResourceCarouselProps {
  title: string
  icon: React.ReactNode
  resources: Resource[]
  selectedResources: string[]
  onToggle: (id: string) => void
  colorScheme?: "blue" | "orange" | "purple"
}

const colorStyles = {
  blue: {
    border: "border-border",
    selectedBorder: "border-primary",
    selectedBg: "bg-primary/5",
    checkBg: "bg-primary",
    price: "text-primary",
  },
  orange: {
    border: "border-border",
    selectedBorder: "border-secondary",
    selectedBg: "bg-secondary/10",
    checkBg: "bg-secondary",
    price: "text-secondary",
  },
  purple: {
    border: "border-border",
    selectedBorder: "border-purple-500",
    selectedBg: "bg-purple-50",
    checkBg: "bg-purple-500",
    price: "text-purple-600",
  },
}

export function ResourceCarousel({
  title,
  icon,
  resources,
  selectedResources,
  onToggle,
  colorScheme = "blue",
}: ResourceCarouselProps) {
  if (resources.length === 0) return null

  const colors = colorStyles[colorScheme]

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </div>
      <Carousel opts={{ align: "start" }} className="relative">
        <CarouselContent>
          {resources.map((resource) => {
            const isSelected = selectedResources.includes(resource.id)
            return (
              <CarouselItem key={resource.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <button
                  type="button"
                  onClick={() => onToggle(resource.id)}
                  className={cn(
                    "flex h-full w-full flex-col gap-2 rounded-2xl border-2 p-3 text-left transition-all",
                    isSelected ? `${colors.selectedBorder} ${colors.selectedBg}` : `${colors.border} hover:border-muted-foreground`
                  )}
                >
                  <div className="h-24 w-full overflow-hidden rounded-xl bg-muted">
                    <Image src={resource.image} alt={resource.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">{resource.name}</p>
                    {resource.businessName && (
                      <p className="text-xs text-muted-foreground">by {resource.businessName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{resource.category || resource.type}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-semibold", colors.price)}>${resource.price}</p>
                    {isSelected && (
                      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full", colors.checkBg)}>
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </div>
                </button>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-3" />
        <CarouselNext className="-right-3" />
      </Carousel>
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedResources.length > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            {selectedResources.length} selected
          </Badge>
        )}
      </div>
    </div>
  )
}
