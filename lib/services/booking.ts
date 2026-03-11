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

    checkServiceAvailability: async (serviceId: string, date: string) => {
        const response = await apiClient.get('/v1/bookings/availability/service', { params: { serviceId, date } });
        return response.data;
    },

    createServiceBooking: async (data: {
        serviceId: string;
        date: string;
        startTime: string;
        endTime: string;
        notes?: string;
    }) => {
        const startDateTime = `${data.date}T${data.startTime}:00`;
        const endDateTime = `${data.date}T${data.endTime}:00`;
        const response = await apiClient.post('/v1/bookings/service', {
            serviceId: data.serviceId,
            startDateTime,
            endDateTime,
            notes: data.notes,
        });
        return response.data;
    },

    createMultiSlotBooking: async (data: {
        facilityId: string;
        timeRanges: Array<{ startDateTime: string; endDateTime: string }>;
        notes?: string;
    }) => {
        const response = await apiClient.post('/v1/bookings/multi-slot', data);
        return response.data;
    },
};
