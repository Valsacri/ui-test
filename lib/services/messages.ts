import apiClient from '../api';

export const messagesService = {
    getConversations: async (userId: string) => {
        const response = await apiClient.get(`/v1/conversations/user/${userId}`);
        return response.data;
    },

    /** Get messages. Pass limit (e.g. 50) for fast initial load (latest N only). */
    getMessages: async (conversationId: string, limit?: number) => {
        const params = limit != null && limit > 0 ? { limit } : {};
        const response = await apiClient.get(`/v1/conversations/${conversationId}/messages`, { params });
        return response.data;
    },

    createConversation: async (data: { participantIds: string[]; name?: string }) => {
        const response = await apiClient.post('/v1/conversations', data);
        return response.data;
    },

    /** Get or create a 1:1 conversation with another user. Returns conversation (includes id). */
    getOrCreateConversationWith: async (otherUserId: string) => {
        const response = await apiClient.get(`/v1/conversations/with/${otherUserId}`);
        return response.data as { id: string };
    },

    sendMessage: async (data: { conversationId: string; senderId: string; content: string }) => {
        const response = await apiClient.post(`/v1/conversations/${data.conversationId}/messages`, {
            senderId: data.senderId,
            content: data.content,
        });
        return response.data;
    },

    /** Send a DM to a user (creates conversation if needed). Returns the sent message (includes conversationId). */
    sendDirectMessage: async (data: {
        recipientId: string
        content: string
        type?: string
        referenceId?: string
        referenceType?: string
    }) => {
        const response = await apiClient.post<{ id: string; conversationId: string }>(
            '/v1/conversations/direct',
            {
                recipientId: data.recipientId,
                content: data.content,
                type: data.type ?? 'text',
                referenceId: data.referenceId,
                referenceType: data.referenceType,
            }
        );
        return response.data;
    },

    getUnreadCount: async (userId: string) => {
        const response = await apiClient.get(`/v1/conversations/user/${userId}/unread-count`);
        return response.data;
    },

    /** Mark a conversation as read for the current user (clears unread badge). */
    markAsRead: async (conversationId: string) => {
        await apiClient.put(`/v1/conversations/${conversationId}/read`);
    },

    /** Toggle your reaction (emoji) on a message. Returns updated message with reactions. */
    toggleReaction: async (conversationId: string, messageId: string, emoji: string) => {
        const { data } = await apiClient.post(
            `/v1/conversations/${conversationId}/messages/${messageId}/reactions`,
            { emoji }
        );
        return data;
    },

    /** Edit a message. Allowed only within 2 minutes of sending. Returns updated message. */
    editMessage: async (conversationId: string, messageId: string, content: string) => {
        const { data } = await apiClient.put(
            `/v1/conversations/${conversationId}/messages/${messageId}`,
            { content }
        );
        return data;
    },
};
