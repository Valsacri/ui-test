"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, DollarSign, Star, Wrench } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { MapFilter } from "@/components/sporgates/map-filter"

interface ServicesFilterSidebarProps {
  onDateChange?: (date: Date | undefined) => void
  onPriceRangeChange?: (range: [number, number]) => void
  onServiceTypeChange?: (types: string[]) => void
  onCategoryChange?: (categories: string[]) => void
}

const categories = [
  { id: "coaching", name: "Coaching", count: 45 },
  { id: "training", name: "Personal Training", count: 67 },
  { id: "nutrition", name: "Nutrition", count: 32 },
  { id: "physio", name: "Physiotherapy", count: 28 },
  { id: "wellness", name: "Wellness", count: 41 },
]

const serviceTypes = ["One-on-One", "Group Sessions", "Online", "In-Person"]

export function ServicesFilterSidebar({
  onDateChange,
  onPriceRangeChange,
  onServiceTypeChange,
  onCategoryChange,
}: ServicesFilterSidebarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    onDateChange?.(date)
  }

  const handlePriceRangeChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]]
    setPriceRange(range)
    onPriceRangeChange?.(range)
  }

  const handleServiceTypeToggle = (type: string) => {
    const updated = selectedServiceTypes.includes(type)
      ? selectedServiceTypes.filter((item) => item !== type)
      : [...selectedServiceTypes, type]
    setSelectedServiceTypes(updated)
    onServiceTypeChange?.(updated)
  }

  const handleCategoryToggle = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((item) => item !== categoryId)
      : [...selectedCategories, categoryId]
    setSelectedCategories(updated)
    onCategoryChange?.(updated)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <p className="mt-1 text-sm text-muted-foreground">Find the right service provider</p>
      </div>

      <Separator />

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-secondary" />
          <h4 className="text-sm font-semibold text-foreground">Availability</h4>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          className="rounded-xl border-0"
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </Card>

      <Separator />

      <Card className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-secondary" />
          <h4 className="text-sm font-semibold text-foreground">Service Category</h4>
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
          <Wrench className="h-4 w-4 text-secondary" />
          <h4 className="text-sm font-semibold text-foreground">Service Type</h4>
        </div>
        <div className="space-y-2">
          {serviceTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedServiceTypes.includes(type)}
                onCheckedChange={() => handleServiceTypeToggle(type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </Card>

      <Separator />

      <Card className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-secondary" />
          <h4 className="text-sm font-semibold text-foreground">Price per Session</h4>
        </div>
        <Slider min={0} max={300} step={10} value={priceRange} onValueChange={handlePriceRangeChange} />
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">${priceRange[0]}</Badge>
          <Badge variant="outline" className="text-xs">${priceRange[1]}</Badge>
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
