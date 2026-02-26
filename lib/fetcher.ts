import apiClient from './api'

/**
 * Generic SWR fetcher using the existing apiClient.
 * Automatically attaches JWT token and handles errors.
 *
 * Usage:
 *   const { data, error, isLoading } = useSWR('/activities', fetcher)
 *   const { data } = useSWR(['/activities', { page: 1 }], fetcherWithParams)
 */
export const fetcher = async <T = any>(url: string): Promise<T> => {
    const response = await apiClient.get<T>(url)
    return response.data
}

/**
 * SWR fetcher that supports query parameters.
 * Pass a tuple [url, params] as the SWR key:
 *
 *   useSWR(['/activities', { page: 1, size: 20 }], fetcherWithParams)
 */
export const fetcherWithParams = async <T = any>([url, params]: [string, Record<string, any>]): Promise<T> => {
    const response = await apiClient.get<T>(url, { params })
    return response.data
}

/**
 * SWR configuration defaults for the app.
 * Can be passed to SWRConfig provider or individual hooks.
 */
export const swrDefaults = {
    revalidateOnFocus: false,       // Don't refetch on tab focus
    revalidateIfStale: true,        // Refetch if data is stale
    dedupingInterval: 5000,         // Deduplicate requests within 5s
    errorRetryCount: 2,             // Retry failed requests twice
    shouldRetryOnError: (err: any) => {
        // Don't retry on 401/403 (auth errors)
        return err?.response?.status !== 401 && err?.response?.status !== 403
    },
} as const
