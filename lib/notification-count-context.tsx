"use client"

import React, { createContext, useContext } from "react"

export type UnreadNotificationsUpdater = (prev: number) => number
export type OnUnreadNotificationsChange = (updater: number | UnreadNotificationsUpdater) => void

const NotificationCountContext = createContext<OnUnreadNotificationsChange | null>(null)

export function useNotificationCountUpdate(): OnUnreadNotificationsChange | null {
  return useContext(NotificationCountContext)
}

export const NotificationCountProvider = NotificationCountContext.Provider
