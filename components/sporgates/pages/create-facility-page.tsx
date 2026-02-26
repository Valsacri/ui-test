"use client"

import { useState } from "react"
import {
    ArrowLeft,
    MapPin,
    Clock,
    Upload,
    Plus,
    X,
    Dumbbell,
    Car,
    Wifi,
    ShowerHead,
} from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createFacilitySchema, type CreateFacilityFormData } from "@/lib/validations/forms"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CreateFacilityPageProps {
    onNavigate: (page: PageRoute) => void
}

const facilityTypes = [
    "Basketball Court",
    "Soccer Field",
    "Tennis Court",
    "Swimming Pool",
    "Gym / Fitness Center",
    "Yoga Studio",
    "Multi-Sport Complex",
    "Running Track",
    "Boxing Ring",
]

const amenityOptions = [
    { id: "parking", label: "Parking", icon: Car },
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "showers", label: "Showers", icon: ShowerHead },
    { id: "equipment", label: "Equipment", icon: Dumbbell },
]

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function CreateFacilityPage({ onNavigate }: CreateFacilityPageProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        description: "",
        address: "",
        city: "",
        capacity: "",
        pricePerHour: "",
    })
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateFacilityFormData, string>>>({})
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [operatingDays, setOperatingDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"])
    const [openTime, setOpenTime] = useState("06:00")
    const [closeTime, setCloseTime] = useState("22:00")

    const toggleAmenity = (id: string) => {
        setSelectedAmenities((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        )
    }

    const toggleDay = (day: string) => {
        setOperatingDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        )
    }

    const handleSubmit = () => {
        setFieldErrors({})
        const result = createFacilitySchema.safeParse({
            name: formData.name,
            type: formData.type,
            description: formData.description,
            address: formData.address,
        })
        if (!result.success) {
            const err: Partial<Record<keyof CreateFacilityFormData, string>> = {}
            result.error.errors.forEach((e) => {
                const key = e.path[0] as keyof CreateFacilityFormData
                if (key && !err[key]) err[key] = e.message
            })
            setFieldErrors(err)
            return
        }
        toast.success("Facility created successfully!")
        onNavigate("business-resources")
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => onNavigate("business-resources")}
                    className="rounded-full p-2 hover:bg-muted"
                >
                    <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Add Facility</h1>
                    <p className="text-sm text-muted-foreground">
                        Register a new venue or court for your business
                    </p>
                </div>
            </div>

            {/* Photos */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Facility Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex h-28 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40">
                        <div className="text-center">
                            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                            <p className="mt-1 text-[10px] text-muted-foreground">Cover</p>
                        </div>
                    </div>
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="flex h-28 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/40"
                        >
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Basic Info */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Basic Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">
                            Facility Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setFieldErrors((p) => ({ ...p, name: undefined })) }}
                            placeholder="e.g., Main Basketball Court"
                            className={cn("h-11 w-full rounded-xl border bg-muted px-4 text-sm outline-none focus:border-primary", fieldErrors.name ? "border-red-400" : "border-border")}
                        />
                        {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">
                            Facility Type
                        </label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => { setFormData({ ...formData, type: val }); setFieldErrors((p) => ({ ...p, type: undefined })) }}
                        >
                            <SelectTrigger className={cn("h-11 w-full rounded-xl border bg-muted px-4 text-sm", fieldErrors.type ? "border-red-400" : "border-border")}>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {facilityTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldErrors.type && <p className="mt-1 text-xs text-red-500">{fieldErrors.type}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the facility, surface, lighting, etc."
                            rows={3}
                            className="w-full resize-none rounded-xl border border-border bg-muted p-4 text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-foreground">
                                Capacity
                            </label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                placeholder="Max people"
                                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-foreground">
                                Price / Hour ($)
                            </label>
                            <input
                                type="number"
                                value={formData.pricePerHour}
                                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                                placeholder="0.00"
                                className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                </h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Street address"
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                    />
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City, State"
                        className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-foreground">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                    {amenityOptions.map((amenity) => (
                        <button
                            type="button"
                            key={amenity.id}
                            onClick={() => toggleAmenity(amenity.id)}
                            className={cn(
                                "flex items-center gap-3 rounded-xl border p-3 transition-all",
                                selectedAmenities.includes(amenity.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted"
                            )}
                        >
                            <amenity.icon
                                className={cn(
                                    "h-5 w-5",
                                    selectedAmenities.includes(amenity.id)
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            />
                            <span className="text-xs font-medium text-foreground">{amenity.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Operating Hours */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Operating Hours
                </h3>
                <div className="mb-4 flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                        <button
                            type="button"
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={cn(
                                "rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all",
                                operatingDays.includes(day)
                                    ? "gradient-primary text-white shadow-sm"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">Opens</label>
                        <input
                            type="time"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-foreground">Closes</label>
                        <input
                            type="time"
                            value={closeTime}
                            onChange={(e) => setCloseTime(e.target.value)}
                            className="h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => onNavigate("business-resources")}
                    className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="gradient-primary flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
                >
                    Create Facility
                </button>
            </div>
        </div>
    )
}
