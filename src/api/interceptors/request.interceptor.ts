import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Logger from '../../utils/logger';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    metadata?: {
        requestTimestamp: number;
    };
}

export const setupRequestInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.request.use(
        (config: CustomInternalAxiosRequestConfig) => {
            // Add request timestamp for duration calculation
            config.metadata = { 
                requestTimestamp: new Date().getTime() 
            };

            // Log request
            Logger.logRequest({
                url: config.url || '',
                method: config.method?.toUpperCase() || 'UNKNOWN',
                requestBody: config.data,
                requestHeaders: config.headers as Record<string, string>,
                timestamp: new Date().toISOString()
            });

            // You can add auth token here
            const token = null; // Get from secure storage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            
            // Add any custom headers here
            config.headers['X-Custom-Header'] = 'CustomValue';
            
            return config;
        },
        (error) => {
            Logger.logError(error);
            return Promise.reject(error);
        }
    );
}; 