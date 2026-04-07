import apiClient from '../api';
import { authService } from './auth';

/** Browser: same-origin `/v1/...` so Next rewrites apply and HttpOnly cookies are sent. */
function getNotificationStreamBaseUrl(): string {
    if (typeof window !== 'undefined') {
        return '';
    }
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
}

/**
 * One active fetch/SSE per user per tab. Prevents duplicate events when React Strict Mode
 * remounts, effects re-run, or a new subscription starts before the previous one aborts.
 */
const sseAbortByUserId = new Map<string, AbortController>();

/** Drop duplicate SSE frames for the same notification (overlapping connections or double flush). */
const recentNotificationIds = new Set<string>();
const recentIdQueue: string[] = [];
const MAX_RECENT_IDS = 200;

function rememberNotificationId(id: string): boolean {
    if (recentNotificationIds.has(id)) return false;
    recentNotificationIds.add(id);
    recentIdQueue.push(id);
    if (recentIdQueue.length > MAX_RECENT_IDS) {
        const drop = recentIdQueue.shift();
        if (drop) recentNotificationIds.delete(drop);
    }
    return true;
}

/** Same payload twice within this window counts as one (when id is missing). */
const recentPayloadAt = new Map<string, number>();
const PAYLOAD_DEDUPE_MS = 800;

function shouldNotifyForSsePayload(data: string): boolean {
    try {
        const parsed = JSON.parse(data) as { id?: string };
        if (typeof parsed?.id === 'string' && parsed.id.length > 0) {
            return rememberNotificationId(parsed.id);
        }
    } catch {
        /* not JSON — fall through */
    }
    const now = Date.now();
    const last = recentPayloadAt.get(data);
    if (last != null && now - last < PAYLOAD_DEDUPE_MS) return false;
    recentPayloadAt.set(data, now);
    if (recentPayloadAt.size > 300) {
        const cutoff = now - PAYLOAD_DEDUPE_MS * 2;
        for (const [k, t] of recentPayloadAt) {
            if (t < cutoff) recentPayloadAt.delete(k);
        }
    }
    return true;
}

/**
 * Subscribe to the notification SSE stream (real-time) with auto-reconnection.
 * Call the returned disconnect() on unmount.
 */
export function subscribeToNotificationStream(
    userId: string,
    onNotification: () => void,
    onError?: (err: unknown) => void
): { disconnect: () => void } {
    let aborted = false;
    let retryCount = 0;
    const MAX_RETRIES = 50;
    const RETRY_DELAY = 5000;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
        if (aborted) return;

        if (typeof window !== 'undefined' && !authService.isAuthenticated()) {
            onError?.(new Error('Not authenticated'));
            return;
        }

        const prev = sseAbortByUserId.get(userId);
        if (prev) {
            prev.abort();
            sseAbortByUserId.delete(userId);
        }

        const abort = new AbortController();
        sseAbortByUserId.set(userId, abort);

        const base = getNotificationStreamBaseUrl();
        const url = `${base}/v1/notifications/user/${userId}/stream`;

        fetch(url, {
            signal: abort.signal,
            credentials: 'include',
            headers: {
                Accept: 'text/event-stream',
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`SSE ${res.status}`);
                retryCount = 0;
                const reader = res.body?.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                if (!reader) return;

                const read = () => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            if (!aborted) {
                                reconnectTimer = setTimeout(connect, RETRY_DELAY);
                            }
                            return;
                        }
                        buffer += decoder.decode(value, { stream: true });
                        const events = buffer.split(/\n\n+/);
                        buffer = events.pop() ?? '';
                        for (const raw of events) {
                            if (!raw.trim()) continue;
                            let name = '';
                            const dataLines: string[] = [];
                            for (const line of raw.split('\n')) {
                                if (line.startsWith('event:')) name = line.slice(6).trim();
                                if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
                            }
                            const data = dataLines.length ? dataLines.join('\n') : null;
                            if (name === 'notification' && data && shouldNotifyForSsePayload(data)) {
                                onNotification();
                            }
                        }
                        read();
                    }).catch((err) => {
                        if (err?.name !== 'AbortError' && !aborted) {
                            retryCount++;
                            if (retryCount <= MAX_RETRIES) {
                                reconnectTimer = setTimeout(connect, RETRY_DELAY);
                            }
                        }
                    });
                };
                read();
            })
            .catch((err) => {
                if (err?.name !== 'AbortError' && !aborted) {
                    retryCount++;
                    if (retryCount <= MAX_RETRIES) {
                        reconnectTimer = setTimeout(connect, RETRY_DELAY);
                    }
                }
            });
    };

    connect();

    return {
        disconnect: () => {
            aborted = true;
            if (reconnectTimer != null) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
            const ctrl = sseAbortByUserId.get(userId);
            if (ctrl) {
                ctrl.abort();
                sseAbortByUserId.delete(userId);
            }
        },
    };
}

export const notificationsService = {
    getByUser: async (userId: string) => {
        const response = await apiClient.get(`/v1/notifications/user/${userId}`);
        return response.data;
    },

    getUnreadCount: async (userId: string) => {
        const response = await apiClient.get(`/v1/notifications/user/${userId}/unread-count`);
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await apiClient.put(`/v1/notifications/${id}/read`);
        return response.data;
    },

    approve: async (id: string) => {
        const response = await apiClient.put(`/v1/notifications/${id}/approve`);
        return response.data;
    },

    reject: async (id: string) => {
        const response = await apiClient.put(`/v1/notifications/${id}/reject`);
        return response.data;
    },

    markAsUnread: async (id: string) => {
        const response = await apiClient.put(`/v1/notifications/${id}/unread`);
        return response.data;
    },

    markAllAsRead: async (userId: string) => {
        const response = await apiClient.put(`/v1/notifications/user/${userId}/read-all`);
        return response.data;
    },

    create: async (data: Record<string, unknown>) => {
        const response = await apiClient.post('/v1/notifications', data);
        return response.data;
    },
};
