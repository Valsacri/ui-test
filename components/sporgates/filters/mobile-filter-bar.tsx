"use client"

import {
  Calendar as CalendarIcon,
  DollarSign,
  Tag,
  MapPin,
  Users,
  Clock,
  Star,
  Building2,
} from "lucide-react"
import { FilterButton } from "@/components/sporgates/filters/filter-button"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { MapFilter } from "@/components/sporgates/map-filter"

export type FilterType =
  | "date"
  | "price"
  | "location"
  | "category"
  | "type"
  | "participants"
  | "time"
  | "rating"
  | "facilityType"

interface CategoryOption {
  id: string
  name: string
  count?: number
  color?: string
}

interface MobileFilterBarProps {
  filters: FilterType[]
  selectedDate?: Date
  onDateChange?: (date: Date | undefined) => void
  priceRange?: [number, number]
  onPriceChange?: (range: [number, number]) => void
  priceMin?: number
  priceMax?: number
  priceStep?: number
  selectedLocation?: string
  onLocationChange?: (location: string) => void
  city?: string
  onCityChange?: (city: string) => void
  neighborhood?: string
  onNeighborhoodChange?: (neighborhood: string) => void
  categories?: CategoryOption[]
  selectedCategories?: string[]
  onCategoryChange?: (categories: string[]) => void
  typeOptions?: { value: string; label: string }[]
  selectedType?: string
  onTypeChange?: (type: string) => void
  typeLabel?: string
  participantRange?: [number, number]
  onParticipantChange?: (range: [number, number]) => void
  participantMin?: number
  participantMax?: number
  timeSlots?: { time: string; available: boolean; count?: number }[]
  selectedTimeSlot?: string
  onTimeSlotChange?: (time: string) => void
  selectedRating?: number
  onRatingChange?: (rating: number) => void
  facilityTypes?: { value: string; label: string; icon?: React.ReactNode }[]
  selectedFacilityType?: string
  onFacilityTypeChange?: (type: string) => void
}

export function MobileFilterBar({
  filters,
  selectedDate,
  onDateChange,
  priceRange = [0, 500],
  onPriceChange,
  priceMin = 0,
  priceMax = 500,
  priceStep = 10,
  selectedLocation = "all",
  onLocationChange,
  city = "",
  onCityChange,
  neighborhood = "",
  onNeighborhoodChange,
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  typeOptions = [],
  selectedType = "all",
  onTypeChange,
  typeLabel = "Type",
  participantRange = [1, 50],
  onParticipantChange,
  participantMin = 1,
  participantMax = 50,
  timeSlots = [],
  selectedTimeSlot,
  onTimeSlotChange,
  selectedRating,
  onRatingChange,
  facilityTypes = [],
  selectedFacilityType = "all",
  onFacilityTypeChange,
}: MobileFilterBarProps) {
  const getFilterValue = (filterType: FilterType): string | undefined => {
    switch (filterType) {
      case "date":
        return selectedDate
          ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : undefined
      case "price":
        return priceRange[0] > priceMin || priceRange[1] < priceMax
          ? `$${priceRange[0]}-$${priceRange[1]}`
          : undefined
      case "location":
        return city || neighborhood || (selectedLocation !== "all" ? selectedLocation : undefined)
      case "category":
        return selectedCategories.length > 0 ? `${selectedCategories.length}` : undefined
      case "type":
        return selectedType !== "all" ? selectedType : undefined
      case "participants":
        return participantRange[0] > participantMin || participantRange[1] < participantMax
          ? `${participantRange[0]}-${participantRange[1]}`
          : undefined
      case "time":
        return selectedTimeSlot || undefined
      case "rating":
        return selectedRating && selectedRating > 0 ? `${selectedRating}+` : undefined
      case "facilityType":
        return selectedFacilityType !== "all" ? selectedFacilityType : undefined
      default:
        return undefined
    }
  }

  const toggleCategory = (id: string) => {
    if (!onCategoryChange) return
    if (selectedCategories.includes(id)) {
      onCategoryChange(selectedCategories.filter((item) => item !== id))
    } else {
      onCategoryChange([...selectedCategories, id])
    }
  }

  const renderFilter = (filterType: FilterType) => {
    switch (filterType) {
      case "date":
        return (
          <FilterButton
            key="date"
            label="Date"
            value={getFilterValue("date")}
            icon={<CalendarIcon className="h-4 w-4" />}
            onClear={() => onDateChange?.(undefined)}
          >
            <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} className="rounded-xl" />
          </FilterButton>
        )
      case "price":
        return (
          <FilterButton
            key="price"
            label="Price"
            value={getFilterValue("price")}
            icon={<DollarSign className="h-4 w-4" />}
            onClear={() => onPriceChange?.([priceMin, priceMax])}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Slider
                min={priceMin}
                max={priceMax}
                step={priceStep}
                value={priceRange}
                onValueChange={(value) => onPriceChange?.(value as [number, number])}
              />
            </div>
          </FilterButton>
        )
      case "location":
        return (
          <FilterButton
            key="location"
            label="Location"
            value={getFilterValue("location")}
            icon={<MapPin className="h-4 w-4" />}
            onClear={() => {
              onLocationChange?.("all")
              onCityChange?.("")
              onNeighborhoodChange?.("")
            }}
          >
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">City</Label>
                  <input
                    value={city}
                    onChange={(event) => onCityChange?.(event.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Neighborhood</Label>
                  <input
                    value={neighborhood}
                    onChange={(event) => onNeighborhoodChange?.(event.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-border bg-muted px-3 text-xs"
                  />
                </div>
              </div>
              <MapFilter onChange={(distance) => onLocationChange?.(`${distance} mi`)} />
            </div>
          </FilterButton>
        )
      case "category":
        return (
          <FilterButton
            key="category"
            label="Categories"
            value={getFilterValue("category")}
            icon={<Tag className="h-4 w-4" />}
            onClear={() => onCategoryChange?.([])}
          >
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <span>{category.name}</span>
                  </div>
                  {category.count !== undefined && (
                    <Badge className="rounded-full bg-muted px-2 text-[10px] text-muted-foreground">
                      {category.count}
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          </FilterButton>
        )
      case "type":
        return (
          <FilterButton
            key="type"
            label={typeLabel}
            value={getFilterValue("type")}
            icon={<Users className="h-4 w-4" />}
            onClear={() => onTypeChange?.("all")}
          >
            <RadioGroup value={selectedType} onValueChange={(value) => onTypeChange?.(value)}>
              {typeOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-xs">
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
          </FilterButton>
        )
      case "participants":
        return (
          <FilterButton
            key="participants"
            label="Participants"
            value={getFilterValue("participants")}
            icon={<Users className="h-4 w-4" />}
            onClear={() => onParticipantChange?.([participantMin, participantMax])}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{participantRange[0]}</span>
                <span>{participantRange[1]}</span>
              </div>
              <Slider
                min={participantMin}
                max={participantMax}
                value={participantRange}
                onValueChange={(value) => onParticipantChange?.(value as [number, number])}
              />
            </div>
          </FilterButton>
        )
      case "time":
        return (
          <FilterButton
            key="time"
            label="Time"
            value={getFilterValue("time")}
            icon={<Clock className="h-4 w-4" />}
            onClear={() => onTimeSlotChange?.("")}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => onTimeSlotChange?.(slot.time)}
                  disabled={!slot.available}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-xs disabled:opacity-40"
                >
                  <span>{slot.time}</span>
                  {slot.count !== undefined && <span className="text-muted-foreground">{slot.count}</span>}
                </button>
              ))}
            </div>
          </FilterButton>
        )
      case "rating":
        return (
          <FilterButton
            key="rating"
            label="Rating"
            value={getFilterValue("rating")}
            icon={<Star className="h-4 w-4" />}
            onClear={() => onRatingChange?.(0)}
          >
            <div className="grid grid-cols-2 gap-2">
              {[5, 4, 3, 2].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onRatingChange?.(rating)}
                  className="rounded-xl border border-border px-3 py-2 text-xs"
                >
                  {rating}+ stars
                </button>
              ))}
            </div>
          </FilterButton>
        )
      case "facilityType":
        return (
          <FilterButton
            key="facilityType"
            label="Facility"
            value={getFilterValue("facilityType")}
            icon={<Building2 className="h-4 w-4" />}
            onClear={() => onFacilityTypeChange?.("all")}
          >
            <div className="space-y-2">
              {facilityTypes.map((facility) => (
                <button
                  key={facility.value}
                  type="button"
                  onClick={() => onFacilityTypeChange?.(facility.value)}
                  className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {facility.icon}
                    <span>{facility.label}</span>
                  </div>
                  {selectedFacilityType === facility.value && (
                    <Badge className="rounded-full bg-secondary px-2 text-[10px] text-white">Selected</Badge>
                  )}
                </button>
              ))}
            </div>
          </FilterButton>
        )
      default:
        return null
    }
  }

  return <div className="flex flex-wrap gap-2">{filters.map((filter) => renderFilter(filter))}</div>
}
