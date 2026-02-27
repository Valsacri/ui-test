import apiClient from '../api';
import { STORAGE_KEYS } from '../constants';

const getApiBaseUrl = () => typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:8080/api';

/**
 * Subscribe to the notification SSE stream (real-time). Uses fetch + auth header.
 * Call the returned disconnect() on unmount.
 */
export function subscribeToNotificationStream(
    userId: string,
    onNotification: () => void,
    onError?: (err: unknown) => void
): { disconnect: () => void } {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
    if (!token) {
        onError?.(new Error('No auth token'));
        return { disconnect: () => {} };
    }
    const url = `${getApiBaseUrl()}/v1/notifications/user/${userId}/stream`;
    const abort = new AbortController();

    fetch(url, {
        signal: abort.signal,
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
            if (!res.ok) throw new Error(`SSE ${res.status}`);
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            if (!reader) return;

            const read = () => {
                reader.read().then(({ done, value }) => {
                    if (done) return;
                    buffer += decoder.decode(value, { stream: true });
                    const events = buffer.split(/\n\n+/);
                    buffer = events.pop() ?? '';
                    for (const raw of events) {
                        let name = '';
                        let data: string | null = null;
                        for (const line of raw.split('\n')) {
                            if (line.startsWith('event:')) name = line.slice(6).trim();
                            if (line.startsWith('data:')) data = line.slice(5).trim();
                        }
                        if (name === 'notification' && data) onNotification();
                    }
                    read();
                }).catch((err) => {
                    if (err?.name !== 'AbortError') onError?.(err);
                });
            };
            read();
        })
        .catch((err) => {
            if (err?.name !== 'AbortError') onError?.(err);
        });

    return {
        disconnect: () => abort.abort(),
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
