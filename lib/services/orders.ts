import apiClient from '../api';

export const ordersService = {
    createOrder: async (data: {
        items: Array<{ productId: string; quantity: number }>;
        shippingAddress?: string;
        shippingCity?: string;
        shippingState?: string;
        shippingPostalCode?: string;
        shippingCountry?: string;
        notes?: string;
    }) => {
        const response = await apiClient.post('/v1/orders', data);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await apiClient.get('/v1/orders/my-orders');
        return response.data;
    },

    getOrder: async (id: string) => {
        const response = await apiClient.get(`/v1/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id: string, status: string) => {
        const response = await apiClient.patch(`/v1/orders/${id}/status`, null, { params: { status } });
        return response.data;
    },
};
