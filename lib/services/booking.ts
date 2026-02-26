import apiClient from '../api';

/** Backend expects startDateTime, endDateTime (ISO), duration, facilityId, notes */
export const bookingService = {
    createBooking: async (data: {
        facilityId: string;
        date: string;
        startTime: string;
        endTime: string;
        notes?: string;
        duration?: number;
    }) => {
        const duration = data.duration ?? 1;
        const startDateTime = `${data.date}T${data.startTime}:00.000Z`;
        const endDateTime = `${data.date}T${data.endTime}:00.000Z`;
        const response = await apiClient.post('/v1/bookings', {
            facilityId: data.facilityId,
            startDateTime,
            endDateTime,
            duration,
            notes: data.notes,
        });
        return response.data;
    },

    getUserBookings: async () => {
        const response = await apiClient.get('/v1/bookings/my-bookings');
        return response.data;
    },

    getBusinessBookings: async (businessId: string) => {
        const response = await apiClient.get(`/v1/bookings/business/${businessId}`);
        return response.data;
    },

    getBusinessBookingsGrouped: async (businessId: string) => {
        const response = await apiClient.get(`/v1/bookings/business/${businessId}/grouped`);
        return response.data;
    },

    confirmBooking: async (bookingId: string) => {
        const response = await apiClient.put(`/v1/bookings/${bookingId}/confirm`);
        return response.data;
    },

    rejectBooking: async (bookingId: string) => {
        const response = await apiClient.put(`/v1/bookings/${bookingId}/reject`);
        return response.data;
    },

    updateBookingStatus: async (bookingId: string, status: string) => {
        const response = await apiClient.put(`/v1/bookings/${bookingId}/status`, null, { params: { status } });
        return response.data;
    },

    cancelBooking: async (bookingId: string) => {
        const response = await apiClient.delete(`/v1/bookings/${bookingId}`);
        return response.data;
    },

    checkAvailability: async (facilityId: string, date: string) => {
        const response = await apiClient.get('/v1/bookings/availability', { params: { facilityId, date } });
        return response.data;
    },
};
