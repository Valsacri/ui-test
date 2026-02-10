"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SortOption {
    value: string
    label: string
}

interface SortFilterProps {
    options: SortOption[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function SortFilter({
    options,
    value,
    onValueChange,
    placeholder = "Sort by",
    className,
}: SortFilterProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger
                className={cn(
                    "h-8 w-fit rounded-lg border border-border bg-card px-3 text-xs font-medium transition-colors hover:bg-muted focus:ring-1 focus:ring-primary",
                    className
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align="end">
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
