import apiClient from '../api';

export const bookingService = {
    createBooking: async (data: {
        facilityId: string;
        date: string;
        startTime: string;
        endTime: string;
        notes?: string;
    }) => {
        const response = await apiClient.post('/bookings', data);
        return response.data;
    },

    getUserBookings: async () => {
        const response = await apiClient.get('/bookings/my-bookings');
        return response.data;
    },

    getBusinessBookings: async (businessId: string) => {
        const response = await apiClient.get(`/bookings/business/${businessId}`);
        return response.data;
    },

    getBusinessBookingsGrouped: async (businessId: string) => {
        const response = await apiClient.get(`/bookings/business/${businessId}/grouped`);
        return response.data;
    },

    confirmBooking: async (bookingId: string) => {
        const response = await apiClient.put(`/bookings/${bookingId}/confirm`);
        return response.data;
    },

    rejectBooking: async (bookingId: string) => {
        const response = await apiClient.put(`/bookings/${bookingId}/reject`);
        return response.data;
    },

    updateBookingStatus: async (bookingId: string, status: string) => {
        const response = await apiClient.put(`/bookings/${bookingId}/status`, null, { params: { status } });
        return response.data;
    },

    cancelBooking: async (bookingId: string) => {
        const response = await apiClient.delete(`/bookings/${bookingId}`);
        return response.data;
    },

    checkAvailability: async (facilityId: string, date: string) => {
        const response = await apiClient.get('/bookings/availability', { params: { facilityId, date } });
        return response.data;
    },
};
