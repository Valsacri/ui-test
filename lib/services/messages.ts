import apiClient from '../api';

export const messagesService = {
    getConversations: async (userId: string) => {
        const response = await apiClient.get(`/v1/conversations/user/${userId}`);
        return response.data;
    },

    getMessages: async (conversationId: string) => {
        const response = await apiClient.get(`/v1/conversations/${conversationId}/messages`);
        return response.data;
    },

    createConversation: async (data: { participantIds: string[]; name?: string }) => {
        const response = await apiClient.post('/v1/conversations', data);
        return response.data;
    },

    sendMessage: async (data: { conversationId: string; senderId: string; content: string }) => {
        const response = await apiClient.post(`/v1/conversations/${data.conversationId}/messages`, {
            senderId: data.senderId,
            content: data.content,
        });
        return response.data;
    },
};
