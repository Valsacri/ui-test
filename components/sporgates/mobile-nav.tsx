"use client"

import { useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  onClick?: () => void
  badge?: number
}

interface MobileNavProps {
  items: NavItem[]
  activeItem: string
  onItemClick: (id: string) => void
}

export function MobileNav({ items, activeItem, onItemClick }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around px-2 pb-4 pt-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onItemClick(item.id)
                item.onClick?.()
              }}
              className={cn(
                "relative flex flex-col items-center justify-center px-3 py-2 text-xs font-semibold transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -right-2 -top-1 rounded-full bg-secondary px-1.5 text-[10px] font-bold text-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[10px]">{item.label}</span>
              {isActive && <span className="absolute -top-px left-0 right-0 h-0.5 bg-primary" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

interface MobileMenuButtonProps {
  onClick: () => void
  isOpen?: boolean
}

export function MobileMenuButton({ onClick, isOpen = false }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full p-2 text-foreground transition-colors hover:bg-muted md:hidden"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  )
}

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  side?: "left" | "right"
}

export function MobileSidebar({ isOpen, onClose, children, side = "left" }: MobileSidebarProps) {
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] md:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur"
        aria-label="Close"
      />
      <div
        className={cn(
          "absolute top-0 h-full w-[280px] bg-card shadow-xl transition-transform",
          side === "left" ? "left-0" : "right-0"
        )}
      >
        <div className="flex items-center justify-end border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-full overflow-y-auto pb-20">{children}</div>
      </div>
    </div>
  )
}
