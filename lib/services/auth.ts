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
    nextStep?: 'LOGIN' | 'VERIFY_EMAIL' | 'ONBOARDING' | 'NONE';
    /**
     * When nextStep is ONBOARDING: core steps — goals or undefined for choose-sports.
     */
    onboardingHint?: string | null;
    /** True when sports+goals are done but extended profile steps remain (soft prompt; not blocking). */
    extendedOnboardingPending?: boolean | null;
    /** Suggested extended step: location, roles, availability, notifications. */
    extendedOnboardingHint?: string | null;
    message?: string;
}

function clearLegacyTokenStorage() {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
        /* ignore */
    }
}

clearLegacyTokenStorage();

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        const d = response.data;
        if (d.accessToken) {
            authService._saveSession(d);
        }
        return d;
    },

    /** Google Sign-In: ID token is verified server-side; HttpOnly cookies are set like email/password login. */
    loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/google', { idToken });
        const d = response.data;
        if (d.accessToken) {
            authService._saveSession(d);
        }
        return d;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/signup', data);
        const d = response.data;
        if (d.accessToken) {
            authService._saveSession(d);
        }
        return d;
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch {
            /* still clear client state */
        }
        localStorage.removeItem(STORAGE_KEYS.USER);
        document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
        clearLegacyTokenStorage();
    },

    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem(STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    /** @deprecated Tokens live in HttpOnly cookies; do not use for API auth. */
    getToken: () => {
        return null;
    },

    getRefreshToken: () => {
        return null;
    },

    isAuthenticated: () => {
        return !!authService.getCurrentUser();
    },

    verifyEmail: async (email: string, code: string): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/verify-email', { email, code });
        const data = response.data;
        if (data?.accessToken) {
            authService._saveSession(data);
        }
        return data;
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

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/refresh', {});
        if (response.data.accessToken) {
            authService._saveSession(response.data);
        }
        return response.data;
    },

    /** Persist non-sensitive profile for UI; JWTs remain HttpOnly cookies only. */
    _saveSession: (d: AuthResponse) => {
        clearLegacyTokenStorage();
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
            id: d.userId, email: d.email,
            firstName: d.firstName, lastName: d.lastName,
            username: d.username,
            extendedOnboardingPending: d.extendedOnboardingPending ?? false,
            extendedOnboardingHint: d.extendedOnboardingHint ?? null,
        }));
        document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    },
};
