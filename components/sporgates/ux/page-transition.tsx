"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        "transition-all duration-300",
        mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export function FadeTransition({ children, className }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        "transition-opacity duration-200",
        mounted ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}
