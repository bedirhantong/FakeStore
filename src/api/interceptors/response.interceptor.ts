import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../types/product.types';
import Logger from '../../utils/logger';

interface RequestConfig extends Record<string, any> {
    metadata?: {
        requestTimestamp: number;
    };
}

export const setupResponseInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            const config = response.config as RequestConfig;
            const duration = config.metadata?.requestTimestamp
                ? new Date().getTime() - config.metadata.requestTimestamp
                : 0;

            Logger.logResponse({
                url: response.config.url || '',
                method: response.config.method?.toUpperCase() || 'UNKNOWN',
                requestBody: response.config.data,
                requestHeaders: response.config.headers as Record<string, string>,
                timestamp: new Date().toISOString(),
                status: response.status,
                responseBody: response.data,
                responseHeaders: response.headers as Record<string, string>,
                duration,
                isSuccess: response.status >= 200 && response.status < 300
            });

            return response;
        },
        (error: AxiosError): Promise<ApiError> => {
            const response = error.response;
            const config = error.config as RequestConfig;
            const duration = config?.metadata?.requestTimestamp
                ? new Date().getTime() - config.metadata.requestTimestamp
                : 0;

            if (response) {
                Logger.logResponse({
                    url: config?.url || '',
                    method: config?.method?.toUpperCase() || 'UNKNOWN',
                    requestBody: config?.data,
                    requestHeaders: config?.headers as Record<string, string>,
                    timestamp: new Date().toISOString(),
                    status: response.status,
                    responseBody: response.data,
                    responseHeaders: response.headers as Record<string, string>,
                    duration,
                    isSuccess: false
                });
            } else {
                Logger.logError(error);
            }

            const errorResponse: ApiError = {
                code: error.code || 'UNKNOWN_ERROR',
                message: error.message || 'An unexpected error occurred',
                status: response?.status || 500
            };
            
            return Promise.reject(errorResponse);
        }
    );
}; 