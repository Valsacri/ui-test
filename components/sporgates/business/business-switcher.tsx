"use client"

import { useState } from "react"
import { Building2, ChevronDown, Check, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Business {
  id: string
  name: string
  type: string
  logo?: string
  role: "owner" | "manager" | "staff"
}

interface BusinessSwitcherProps {
  businesses: Business[]
  currentBusinessId: string
  onBusinessChange: (businessId: string) => void
  onCreateBusiness: () => void
}

export function BusinessSwitcher({
  businesses,
  currentBusinessId,
  onBusinessChange,
  onCreateBusiness,
}: BusinessSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentBusiness = businesses.find((business) => business.id === currentBusinessId)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          {currentBusiness?.logo ? (
            <img src={currentBusiness.logo} alt="" className="h-full w-full rounded-xl object-cover" />
          ) : (
            <Building2 className="h-4 w-4" />
          )}
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-foreground">{currentBusiness?.name ?? "Business"}</p>
          <p className="text-[10px] capitalize text-muted-foreground">{currentBusiness?.role ?? "owner"}</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
            aria-label="Close"
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-72">
            <Card className="space-y-2 p-2 shadow-lg">
              <div className="px-2 pt-1 text-[10px] font-semibold text-muted-foreground">
                Your Businesses
              </div>

              <div className="space-y-1">
                {businesses.map((business) => (
                  <button
                    key={business.id}
                    type="button"
                    onClick={() => {
                      onBusinessChange(business.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                      business.id === currentBusinessId
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      {business.logo ? (
                        <img src={business.logo} alt="" className="h-full w-full rounded-xl object-cover" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{business.name}</p>

                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="capitalize">{business.role}</span>
                      {business.id === currentBusinessId && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-border pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onCreateBusiness()
                    setIsOpen(false)
                  }}
                  className="w-full justify-start gap-2 text-xs"
                >
                  <Plus className="h-4 w-4" />
                  Create New Business
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
