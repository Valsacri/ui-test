import apiClient from '../api';

export const messagesService = {
    getConversations: async (userId: string) => {
        const response = await apiClient.get(`/v1/messages/conversations/${userId}`);
        return response.data;
    },

    getMessages: async (conversationId: string) => {
        const response = await apiClient.get(`/v1/messages/conversations/${conversationId}/messages`);
        return response.data;
    },

    createConversation: async (data: { participantIds: string[]; name?: string }) => {
        const response = await apiClient.post('/v1/messages/conversations', data);
        return response.data;
    },

    sendMessage: async (data: { conversationId: string; senderId: string; content: string }) => {
        const response = await apiClient.post('/v1/messages/send', data);
        return response.data;
    },

    getUnreadCount: async (userId: string) => {
        const response = await apiClient.get(`/v1/messages/unread-count/${userId}`);
        return response.data;
    },
};
