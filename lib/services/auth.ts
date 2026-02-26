import apiClient from '../api';
import { STORAGE_KEYS, AUTH_COOKIE_NAME } from '../constants';

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
            authService._saveTokens(d);
        }
        return d;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/signup', data);
        const d = response.data;
        if (d.accessToken) {
            authService._saveTokens(d);
        }
        return d;
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
    },

    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem(STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        }
        return null;
    },

    getRefreshToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
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
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
            if (response.data.refreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
            }
        }
        return response.data;
    },

    /** Internal helper — saves tokens + user + sets auth cookie marker */
    _saveTokens: (d: AuthResponse) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, d.accessToken);
        if (d.refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, d.refreshToken);
        }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
            id: d.userId, email: d.email,
            firstName: d.firstName, lastName: d.lastName,
            username: d.username,
        }));
        // Set cookie marker for middleware auth check (365 days)
        document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    },
};
