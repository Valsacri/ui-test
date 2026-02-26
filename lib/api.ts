import axios from 'axios';
import { STORAGE_KEYS, AUTH_COOKIE_NAME, API_TIMEOUT_MS, DEFAULT_API_BASE_URL } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT_MS,
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor: handle 401 (token expired)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            if (typeof window !== 'undefined') {
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                if (refreshToken) {
                    try {
                        // Use raw axios to bypass interceptors for refresh call
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                        const { accessToken, refreshToken: newRefreshToken } = response.data;

                        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
                        if (newRefreshToken) {
                            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
                        }

                        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                        originalRequest.headers.Authorization = 'Bearer ' + accessToken;

                        processQueue(null, accessToken);

                        return apiClient(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);

                        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                        localStorage.removeItem(STORAGE_KEYS.USER);
                        document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
                        window.dispatchEvent(new CustomEvent('auth:logout'));

                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }
            }

            // If no refresh token or not browser env, logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
