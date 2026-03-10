"use client"

import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const getHttpBaseUrl = (): string => {
  return typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:8080/api'
}

let sharedClient: Client | null = null

function getClient(): Client {
  if (sharedClient) return sharedClient
  const url = getHttpBaseUrl() + '/ws'
  sharedClient = new Client({
    webSocketFactory: () => new SockJS(url) as unknown as WebSocket,
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  })
  return sharedClient
}

export interface MessagePayload {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt?: string
  type?: string
  referenceId?: string
  referenceType?: string
  /** emoji -> list of userIds who reacted */
  reactions?: Record<string, string[]>
  /** Set when message was edited (ISO string or array). */
  editedAt?: string | number[] | null
  /** True when the message has been seen by the recipient (for read receipts). */
  read?: boolean
}

export type Unsubscribe = () => void

/**
 * Subscribe to real-time messages for a conversation.
 * Returns an unsubscribe function. When a message is received, onMessage is called.
 * If the server sends a read receipt (type: "read", messageIds: string[]), onReadReceipt is called.
 */
export function subscribeToConversation(
  conversationId: string,
  onMessage: (msg: MessagePayload) => void,
  onConnected?: () => void,
  onReadReceipt?: (messageIds: string[]) => void
): Unsubscribe {
  const client = getClient()
  let subId: string | null = null

  const subscribe = () => {
    if (!client.connected) return
    subId = client.subscribe(
      `/topic/conversation/${conversationId}`,
      (frame) => {
        try {
          const body = JSON.parse(frame.body) as MessagePayload & { type?: string; messageIds?: string[] }
          if (body.type === 'read' && Array.isArray(body.messageIds)) {
            onReadReceipt?.(body.messageIds)
          } else {
            onMessage(body)
          }
        } catch {
          // ignore parse errors
        }
      }
    ).id
    onConnected?.()
  }

  if (client.connected) {
    subscribe()
  } else {
    client.onConnect = () => subscribe()
    if (!client.active) client.activate()
  }

  return () => {
    if (subId && client.connected) {
      try {
        client.unsubscribe(subId)
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Subscribe to all messages for the current user (any conversation).
 * Use this so messages appear instantly even for newly created conversations (e.g. story reply).
 * Backend sends each new message to /topic/user/{userId}/messages for each participant.
 */
export function subscribeToUserMessages(
  userId: string,
  onMessage: (msg: MessagePayload) => void,
  onConnected?: () => void
): Unsubscribe {
  const client = getClient()
  let subId: string | null = null

  const subscribe = () => {
    if (!client.connected) return
    subId = client.subscribe(
      `/topic/user/${userId}/messages`,
      (frame) => {
        try {
          const body = JSON.parse(frame.body) as MessagePayload
          onMessage(body)
        } catch {
          // ignore parse errors
        }
      }
    ).id
    onConnected?.()
  }

  if (client.connected) {
    subscribe()
  } else {
    client.onConnect = () => subscribe()
    if (!client.active) client.activate()
  }

  return () => {
    if (subId && client.connected) {
      try {
        client.unsubscribe(subId)
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Send a message over WebSocket. Backend persists and broadcasts to the conversation topic.
 * Returns true if the message was sent over WS, false if not connected (caller may fallback to REST).
 */
export function sendMessageOverWs(
  conversationId: string,
  payload: { senderId: string; senderName?: string; content: string; type?: string }
): boolean {
  const client = getClient()
  const dest = `/app/chat.send/${conversationId}`
  if (client.connected) {
    client.publish({
      destination: dest,
      body: JSON.stringify({
        senderId: payload.senderId,
        senderName: payload.senderName ?? '',
        content: payload.content,
        type: payload.type ?? 'text',
      }),
    })
    return true
  }
  return false
}

export function isMessagingWsConnected(): boolean {
  return sharedClient?.connected ?? false
}
