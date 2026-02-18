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
    accessToken: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
    twoFactorEnabled?: boolean;
    profileCompletion?: number;
}

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', data);
        const d = response.data;
        if (d.accessToken) {
            localStorage.setItem('auth_token', d.accessToken);
            if (d.refreshToken) {
                localStorage.setItem('refresh_token', d.refreshToken);
            }
            localStorage.setItem('user', JSON.stringify({
                id: d.userId, email: d.email,
                firstName: d.firstName, lastName: d.lastName,
                username: d.username,
            }));
        }
        return d;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/signup', data);
        const d = response.data;
        if (d.accessToken) {
            localStorage.setItem('auth_token', d.accessToken);
            if (d.refreshToken) {
                localStorage.setItem('refresh_token', d.refreshToken);
            }
            localStorage.setItem('user', JSON.stringify({
                id: d.userId, email: d.email,
                firstName: d.firstName, lastName: d.lastName,
                username: d.username,
            }));
        }
        return d;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
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

    getRefreshToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refresh_token');
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
        if (response.data.accessToken) {
            localStorage.setItem('auth_token', response.data.accessToken);
            if (response.data.refreshToken) {
                localStorage.setItem('refresh_token', response.data.refreshToken);
            }
        }
        return response.data;
    },
};
