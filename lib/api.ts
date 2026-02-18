import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
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
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    try {
                        // Use raw axios to bypass interceptors for refresh call
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                        const { accessToken, refreshToken: newRefreshToken } = response.data;

                        localStorage.setItem('auth_token', accessToken);
                        if (newRefreshToken) {
                            localStorage.setItem('refresh_token', newRefreshToken);
                        }

                        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                        originalRequest.headers.Authorization = 'Bearer ' + accessToken;

                        processQueue(null, accessToken);

                        return apiClient(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);

                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        window.dispatchEvent(new CustomEvent('auth:logout'));

                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }
            }

            // If no refresh token or not browser env, logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
