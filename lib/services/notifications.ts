import apiClient from '../api';
import { STORAGE_KEYS } from '../constants';

const getApiBaseUrl = () => typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:8080/api';

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
    const RETRY_DELAY = 5000; // 5 seconds

    const connect = () => {
        if (aborted) return;

        const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
        if (!token) {
            onError?.(new Error('No auth token'));
            return;
        }

        const url = `${getApiBaseUrl()}/v1/notifications/user/${userId}/stream`;
        const abort = new AbortController();

        fetch(url, {
            signal: abort.signal,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'text/event-stream',
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`SSE ${res.status}`);
                retryCount = 0; // reset on successful connection
                const reader = res.body?.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                if (!reader) return;

                const read = () => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            // Stream ended — reconnect
                            if (!aborted) setTimeout(connect, RETRY_DELAY);
                            return;
                        }
                        buffer += decoder.decode(value, { stream: true });
                        const events = buffer.split(/\n\n+/);
                        buffer = events.pop() ?? '';
                        for (const raw of events) {
                            let name = '';
                            const dataLines: string[] = [];
                            for (const line of raw.split('\n')) {
                                if (line.startsWith('event:')) name = line.slice(6).trim();
                                if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
                            }
                            const data = dataLines.length ? dataLines.join('\n') : null;
                            if (name === 'notification' && data) onNotification();
                        }
                        read();
                    }).catch((err) => {
                        if (err?.name !== 'AbortError' && !aborted) {
                            // Connection lost — reconnect
                            retryCount++;
                            if (retryCount <= MAX_RETRIES) {
                                setTimeout(connect, RETRY_DELAY);
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
                        setTimeout(connect, RETRY_DELAY);
                    }
                }
            });

        // Store abort for disconnect
        currentAbort = abort;
    };

    let currentAbort: AbortController | null = null;
    connect();

    return {
        disconnect: () => {
            aborted = true;
            currentAbort?.abort();
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
