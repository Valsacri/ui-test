import apiClient from '../api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
    username?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        username?: string;
    };
}

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/signup', data);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    },

    isAuthenticated: () => {
        return !!authService.getToken();
    },

    verifyEmail: async (email: string, code: string): Promise<string> => {
        const response = await apiClient.post('/auth/verify-email', { email, code });
        return response.data;
    },

    resendVerification: async (email: string): Promise<string> => {
        const response = await apiClient.post('/auth/resend-verification', { email });
        return response.data;
    },

    forgotPassword: async (email: string): Promise<string> => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, newPassword: string, confirmPassword: string): Promise<string> => {
        const response = await apiClient.post('/auth/reset-password', { token, newPassword, confirmPassword });
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    },
};
