/**
 * Centralized API error message handling.
 * Maps backend error keys and HTTP status codes to user-friendly messages.
 */

/**
 * Backend ErrorMessage shape returned by GlobalExceptionHandler
 */
export interface ApiErrorResponse {
    key?: string;
    code?: number;
    message?: string;
    messageKeyParameters?: unknown[];
    payload?: Record<string, unknown>;
}

/**
 * Map of backend error keys → user-friendly messages
 */
const ERROR_KEY_MESSAGES: Record<string, string> = {
    // Auth errors
    'auth.wrong.credentials': 'Incorrect email or password. Please try again.',
    'user.not.activated': 'Your account is not active. Please verify your email first.',
    'account.locked': 'Your account has been locked. Please contact support.',
    'user.not.found': 'No account found with this email address.',
    'user.already.exists': 'An account with this email already exists. Try signing in instead.',
    'user.username.exists': 'This username is already taken. Please choose a different one.',
    'passwords.do.not.match': 'Passwords do not match. Please try again.',
    'password.weak': 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
    'password.same.as.old': 'New password cannot be the same as your current password.',

    // Login errors
    'login.failed.unexpected': 'An unexpected error occurred during login. Please try again.',

    // Token errors
    'reset.token.invalid': 'This reset link is invalid or has already been used.',
    'reset.token.expired': 'This reset link has expired. Please request a new one.',
    'refresh.token.invalid': 'Your session has expired. Please sign in again.',

    // Verification errors
    'verification.code.invalid': 'Invalid verification code. Please check and try again.',
    'verification.code.expired': 'Verification code has expired. Please request a new one.',
    'email.already.verified': 'Your email is already verified. You can sign in.',

    // Email errors
    'email.send.failed': 'We couldn\'t send the email. Please try again later.',

    // Validation errors
    'command.invalid.args': 'Please check your input and try again.',

    // Ticket & Check-in errors
    'ticket.invalid': 'The scanned ticket code is invalid or not found.',
    'ticket.not.confirmed': 'This ticket is not confirmed and cannot be used for check-in.',
    'ticket.already.checked.in': 'This ticket has already been used for check-in.',

    // Activity / Booking errors
    'activity.not.found': 'The requested activity could not be found.',
    'attendance.already.registered': 'You have already joined this activity.',
    'activity.full': 'This activity is full. No more spots are available.',
    'booking.not.found': 'Booking not found.',
    'booking.not.pending.approval': 'This booking is not currently pending approval.',

    // Generic
    'error.unexpected': 'Something went wrong. Please try again later.',
};

/**
 * Map of HTTP status codes → fallback messages (used when no error key is available)
 */
const STATUS_CODE_MESSAGES: Record<number, string> = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'Incorrect email or password. Please try again.',
    403: 'You don\'t have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with an existing record.',
    422: 'Please check your input — some fields are invalid.',
    429: 'Too many attempts. Please wait a moment and try again.',
    500: 'Something went wrong on our end. Please try again later.',
    502: 'Our servers are temporarily unavailable. Please try again shortly.',
    503: 'Service is temporarily unavailable. Please try again later.',
};

/**
 * Extract a user-friendly error message from an Axios error or generic error.
 * 
 * @param error - The caught error (Axios error, Error, or unknown)
 * @param fallback - Fallback message if nothing else matches
 * @returns A user-friendly error string
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (!error) return fallback;

    // Handle Axios errors with response data
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
            response?: {
                data?: ApiErrorResponse & { errors?: Record<string, string> };
                status?: number;
            };
            code?: string;
        };

        const data = axiosError.response?.data;
        const status = axiosError.response?.status;

        // First: check for a known error key from the backend
        if (data?.key && ERROR_KEY_MESSAGES[data.key]) {
            return ERROR_KEY_MESSAGES[data.key];
        }

        // Second: check for a message field in the response
        if (data?.message && !data.message.startsWith('Request failed')) {
            return data.message;
        }

        // Third: check for validation errors payload
        if (data?.payload && typeof data.payload === 'object') {
            const fieldErrors = Object.values(data.payload).filter(Boolean);
            if (fieldErrors.length > 0) {
                return String(fieldErrors[0]);
            }
        }

        // Fourth: check for field-level validation errors
        if (data?.errors && typeof data.errors === 'object') {
            const fieldErrors = Object.values(data.errors).filter(Boolean);
            if (fieldErrors.length > 0) {
                return String(fieldErrors[0]);
            }
        }

        // Fifth: map HTTP status code to a friendly message
        if (status && STATUS_CODE_MESSAGES[status]) {
            return STATUS_CODE_MESSAGES[status];
        }

        // Sixth: handle network/timeout errors from Axios
        if (axiosError.code === 'ECONNABORTED') {
            return 'Request timed out. Please check your connection and try again.';
        }
    }

    // Handle network errors (no response at all)
    if (error && typeof error === 'object' && 'message' in error) {
        const msg = (error as Error).message;
        if (msg === 'Network Error' || msg.includes('ERR_CONNECTION_REFUSED')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        // Don't pass through raw Axios messages like "Request failed with status code 401"
        if (msg.startsWith('Request failed with status code')) {
            const statusMatch = msg.match(/\d+/);
            if (statusMatch) {
                const status = parseInt(statusMatch[0], 10);
                return STATUS_CODE_MESSAGES[status] || fallback;
            }
        }
    }

    return fallback;
}

/**
 * Extract the backend error key from an Axios error, if present.
 * Useful for conditional logic (e.g., detecting token expiry).
 */
export function getApiErrorKey(error: unknown): string | null {
    if (error && typeof error === 'object' && 'response' in error) {
        const data = (error as { response?: { data?: { key?: string } } }).response?.data;
        return data?.key ?? null;
    }
    return null;
}

/**
 * Check if an error represents a specific backend error key.
 */
export function isApiError(error: unknown, ...keys: string[]): boolean {
    const errorKey = getApiErrorKey(error);
    return errorKey !== null && keys.includes(errorKey);
}
