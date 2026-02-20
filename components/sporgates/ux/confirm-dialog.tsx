"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "danger" | "warning"
    loading?: boolean
    onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
}: ConfirmDialogProps) {
    const handleConfirm = async () => {
        await onConfirm()
        if (!loading) onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-sm rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 sm:gap-2">
                    <AlertDialogCancel
                        disabled={loading}
                        className="flex-1 rounded-xl border border-border text-xs font-semibold"
                    >
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleConfirm()
                        }}
                        disabled={loading}
                        className={cn(
                            "flex-1 rounded-xl text-xs font-semibold text-white",
                            variant === "danger"
                                ? "bg-destructive hover:bg-destructive/90"
                                : "bg-orange-500 hover:bg-orange-500/90"
                        )}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            confirmLabel
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
