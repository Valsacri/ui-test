"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Building2, Briefcase, Star } from "lucide-react"
import { MapFilter } from "@/components/sporgates/map-filter"

interface BusinessesFilterSidebarProps {
  onBusinessTypeChange?: (type: string) => void
  onCategoryChange?: (categories: string[]) => void
  onRatingChange?: (ratings: string[]) => void
}

const categories = [
  { id: "gym", name: "Gyms & Fitness Centers", count: 48 },
  { id: "sports-complex", name: "Sports Complexes", count: 32 },
  { id: "coaching", name: "Coaching Services", count: 67 },
  { id: "retail", name: "Sports Retail", count: 45 },
  { id: "wellness", name: "Wellness Centers", count: 39 },
]

const ratings = ["4+ Stars", "3+ Stars", "2+ Stars"]

export function BusinessesFilterSidebar({
  onBusinessTypeChange,
  onCategoryChange,
  onRatingChange,
}: BusinessesFilterSidebarProps) {
  const [businessType, setBusinessType] = useState("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])

  const handleBusinessTypeChange = (value: string) => {
    setBusinessType(value)
    onBusinessTypeChange?.(value)
  }

  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((item) => item !== categoryId)
      : [...selectedCategories, categoryId]
    setSelectedCategories(updated)
    onCategoryChange?.(updated)
  }

  const handleRatingToggle = (rating: string) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter((item) => item !== rating)
      : [...selectedRatings, rating]
    setSelectedRatings(updated)
    onRatingChange?.(updated)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <p className="mt-1 text-sm text-muted-foreground">Discover sports businesses</p>
      </div>

      <Separator />

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-secondary" />
          <h4 className="text-sm font-semibold text-foreground">Business Type</h4>
        </div>
        <RadioGroup value={businessType} onValueChange={handleBusinessTypeChange}>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <RadioGroupItem value="all" />
              <span>All Businesses</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="facilities" />
              <span>Facilities</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="services" />
              <span>Service Providers</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="retail" />
              <span>Retail Stores</span>
            </label>
          </div>
        </RadioGroup>
      </Card>

      <Separator />

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-secondary" />
          <h4 className="text-sm font-semibold text-foreground">Category</h4>
        </div>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <span>{category.name}</span>
              </label>
              <Badge variant="outline" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Separator />

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-secondary" />
          <h4 className="text-sm font-semibold text-foreground">Rating</h4>
        </div>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => handleRatingToggle(rating)}
              />
              <span>{rating}</span>
            </label>
          ))}
        </div>
      </Card>

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Location & Distance</p>
        <MapFilter onChange={() => undefined} />
      </div>
    </div>
  )
}
