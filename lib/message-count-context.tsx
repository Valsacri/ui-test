"use client"

import React, { createContext, useContext } from "react"

export type RefetchUnreadMessagesCount = () => void

const MessageCountContext = createContext<RefetchUnreadMessagesCount | null>(null)

export function useRefetchUnreadMessagesCount(): RefetchUnreadMessagesCount | null {
  return useContext(MessageCountContext)
}

export const MessageCountProvider = MessageCountContext.Provider
