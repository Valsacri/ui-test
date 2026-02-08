"use client"

import {
  Search,
  Bell,
  MessageCircle,
  Wallet,
  ChevronDown,
  Target,
  User,
  Building2,
  LogOut,
  Settings,
  CalendarDays,
  Heart,
  Trophy,
  X,
} from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import { goals, userProfile, conversations, notifications } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { PageRoute } from "@/lib/navigation"

const notifTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  activity: CalendarDays,
  social: Heart,
  booking: CalendarDays,
  achievement: Trophy,
  system: Settings,
}

interface TopBarProps {
  onNavigate: (page: PageRoute) => void
  isBusinessMode: boolean
  onToggleBusinessMode: () => void
  unreadMessages: number
  unreadNotifications: number
}

export function TopBar({
  onNavigate,
  isBusinessMode,
  onToggleBusinessMode,
  unreadMessages,
  unreadNotifications,
}: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showWallet, setShowWallet] = useState(false)
  const [showGoal, setShowGoal] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const currentGoal = goals[0]
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeAll = () => {
    setShowProfileMenu(false)
    setShowWallet(false)
    setShowGoal(false)
    setShowMessages(false)
    setShowNotifications(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeAll()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 shadow-sm lg:px-6">
      {/* Logo */}
      <button
        type="button"
        onClick={() => onNavigate(isBusinessMode ? "business-dashboard" : "home")}
        className="flex items-center gap-2"
      >
        <div className="gradient-primary flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white">
          S
        </div>
        <span className="hidden text-xl font-bold text-primary md:block">Sporgates</span>
      </button>

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search activities, facilities, people..."
          className="h-10 w-full rounded-full border border-border bg-muted pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Right actions */}
      <div ref={dropdownRef} className="flex items-center gap-2">
        {/* Goal Widget */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => {
              const next = !showGoal
              closeAll()
              setShowGoal(next)
            }}
            className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
          >
            <Target className="h-3.5 w-3.5 text-secondary" />
            <span className="max-w-[100px] truncate">{currentGoal.title}</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
              <div
                className="gradient-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentGoal.progress / currentGoal.target) * 100}%` }}
              />
            </div>
          </button>
          {showGoal && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
              <h4 className="mb-3 text-sm font-semibold text-foreground">Current Goals</h4>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-muted-foreground">
                        {goal.progress}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-secondary h-full rounded-full transition-all duration-500"
                        style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wallet */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              const next = !showWallet
              closeAll()
              setShowWallet(next)
            }}
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
          >
            <Wallet className="h-3.5 w-3.5 text-primary" />
            <span>${userProfile.walletBalance.toFixed(2)}</span>
          </button>
          {showWallet && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card p-4 shadow-lg">
              <h4 className="mb-2 text-sm font-semibold text-foreground">Wallet</h4>
              <p className="mb-3 text-2xl font-bold text-primary">${userProfile.walletBalance.toFixed(2)}</p>
              <button
                type="button"
                className="gradient-primary w-full rounded-lg py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                Add Funds
              </button>
            </div>
          )}
        </div>

        {/* Messages Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const next = !showMessages
              closeAll()
              setShowMessages(next)
            }}
            className={cn(
              "relative rounded-full p-2 transition-colors hover:bg-muted",
              showMessages && "bg-muted"
            )}
          >
            <MessageCircle className="h-5 w-5 text-foreground" />
            {unreadMessages > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                {unreadMessages}
              </span>
            )}
          </button>
          {showMessages && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl sm:w-96">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-base font-bold text-foreground">Messages</h3>
                <button
                  type="button"
                  onClick={() => setShowMessages(false)}
                  className="rounded-full p-1 transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {conversations.map((convo) => (
                  <button
                    type="button"
                    key={convo.id}
                    onClick={() => {
                      closeAll()
                      onNavigate("messages")
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="relative shrink-0">
                      <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white">
                        {convo.avatar}
                      </div>
                      {convo.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("truncate text-sm", convo.unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground")}>{convo.name}</p>
                        <span className={cn("shrink-0 text-[11px]", convo.unread > 0 ? "font-semibold text-secondary" : "text-muted-foreground")}>{convo.time}</span>
                      </div>
                      <p className={cn("truncate text-xs", convo.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>{convo.lastMessage}</p>
                    </div>
                    {convo.unread > 0 && (
                      <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    closeAll()
                    onNavigate("messages")
                  }}
                  className="flex w-full items-center justify-center py-3 text-sm font-semibold text-secondary transition-colors hover:bg-muted"
                >
                  See All in Messenger
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const next = !showNotifications
              closeAll()
              setShowNotifications(next)
            }}
            className={cn(
              "relative rounded-full p-2 transition-colors hover:bg-muted",
              showNotifications && "bg-muted"
            )}
          >
            <Bell className="h-5 w-5 text-foreground" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                {unreadNotifications}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl sm:w-96">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-base font-bold text-foreground">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
                  >
                    Mark all read
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="rounded-full p-1 transition-colors hover:bg-muted"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notifTypeIcons[notif.type] || Bell
                  return (
                    <button
                      type="button"
                      key={notif.id}
                      onClick={() => {
                        closeAll()
                        onNavigate("notifications")
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted",
                        !notif.read && "bg-secondary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          !notif.read ? "gradient-secondary text-white" : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm", !notif.read ? "font-bold text-foreground" : "font-medium text-foreground")}>{notif.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{notif.message}</p>
                        <p className={cn("mt-0.5 text-[11px]", !notif.read ? "font-semibold text-secondary" : "text-muted-foreground")}>{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    closeAll()
                    onNavigate("notifications")
                  }}
                  className="flex w-full items-center justify-center py-3 text-sm font-semibold text-secondary transition-colors hover:bg-muted"
                >
                  See All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const next = !showProfileMenu
              closeAll()
              setShowProfileMenu(next)
            }}
            className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-muted"
          >
            <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
              {userProfile.avatar}
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card py-2 shadow-lg">
              <div className="border-b border-border px-4 pb-2">
                <p className="text-sm font-semibold text-foreground">{userProfile.name}</p>
                <p className="text-xs text-muted-foreground">{userProfile.username}</p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("profile")
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleBusinessMode()
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Building2 className="h-4 w-4" />
                  {isBusinessMode ? "Switch to User" : "Switch to Business"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("settings")
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("signin")
                    setShowProfileMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive transition-colors hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
