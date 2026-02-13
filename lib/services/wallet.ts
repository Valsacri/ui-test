import apiClient from '../api';

export const walletService = {
    getWallet: async (userId: string) => {
        const response = await apiClient.get(`/v1/wallet/user/${userId}`);
        return response.data;
    },

    deposit: async (userId: string, data: { amount: number; description?: string }) => {
        const response = await apiClient.post(`/v1/wallet/user/${userId}/deposit`, data);
        return response.data;
    },

    getTransactions: async (userId: string) => {
        const response = await apiClient.get(`/v1/wallet/user/${userId}/transactions`);
        return response.data;
    },
};
