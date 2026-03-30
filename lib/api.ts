import axios from 'axios';
import { STORAGE_KEYS, AUTH_COOKIE_NAME, API_TIMEOUT_MS, DEFAULT_API_BASE_URL } from './constants';

/** Browser: same-origin paths proxied to Spring (`/v1`, `/auth`). Server: full backend base when needed. */
function getApiBaseUrl(): string {
    if (typeof window !== 'undefined') {
        return '';
    }
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
}

const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT_MS,
    withCredentials: true,
});

// Request interceptor: for FormData, drop Content-Type so browser sets multipart boundary.
// Auth: HttpOnly cookies (sporgates_access_token) — do not attach Bearer from localStorage.
apiClient.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor: handle 401 (token expired) — refresh via HttpOnly refresh cookie
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) {
            return Promise.reject(error);
        }

        const reqUrl = String(originalRequest.url ?? '');
        if (reqUrl.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return apiClient(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            if (typeof window !== 'undefined') {
                try {
                    const base = getApiBaseUrl();
                    await axios.post(`${base}/auth/refresh`, {}, {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' },
                        timeout: API_TIMEOUT_MS,
                    });

                    processQueue(null, null);

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);

                    localStorage.removeItem(STORAGE_KEYS.USER);
                    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
                    document.dispatchEvent(new CustomEvent('auth:logout'));

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            if (typeof window !== 'undefined') {
                localStorage.removeItem(STORAGE_KEYS.USER);
                document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
                document.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
