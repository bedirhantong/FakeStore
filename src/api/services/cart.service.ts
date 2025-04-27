import axiosInstance from '../config/axios.config';
import { Cart, CartProduct } from '../types/cart.types';
import Logger from '../../utils/logger';

export class CartService {
    private static instance: CartService;
    private readonly BASE_PATH = '/carts';

    private constructor() {}

    public static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }

    async createCart(userId: number): Promise<Cart> {
        try {
            Logger.logRequest({
                url: this.BASE_PATH,
                method: 'POST',
                requestBody: { userId, products: [] },
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString()
            });

            const response = await axiosInstance.post<Cart>(this.BASE_PATH, {
                userId,
                products: []
            });

            Logger.logResponse({
                url: this.BASE_PATH,
                method: 'POST',
                requestBody: { userId, products: [] },
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString(),
                status: response.status,
                responseBody: response.data,
                responseHeaders: response.headers as Record<string, string>,
                duration: 0,
                isSuccess: true
            });

            return response.data;
        } catch (error) {
            Logger.logError(error);
            throw error;
        }
    }

    async updateCart(cartId: number, products: CartProduct[]): Promise<Cart> {
        try {
            const url = `${this.BASE_PATH}/${cartId}`;
            Logger.logRequest({
                url,
                method: 'PUT',
                requestBody: { products },
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString()
            });

            const response = await axiosInstance.put<Cart>(url, {
                products
            });

            Logger.logResponse({
                url,
                method: 'PUT',
                requestBody: { products },
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString(),
                status: response.status,
                responseBody: response.data,
                responseHeaders: response.headers as Record<string, string>,
                duration: 0,
                isSuccess: true
            });

            return response.data;
        } catch (error) {
            Logger.logError(error);
            throw error;
        }
    }

    async getCartById(cartId: number): Promise<Cart> {
        try {
            const url = `${this.BASE_PATH}/${cartId}`;
            Logger.logRequest({
                url,
                method: 'GET',
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString()
            });

            const response = await axiosInstance.get<Cart>(url);

            Logger.logResponse({
                url,
                method: 'GET',
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString(),
                status: response.status,
                responseBody: response.data,
                responseHeaders: response.headers as Record<string, string>,
                duration: 0,
                isSuccess: true
            });

            return response.data;
        } catch (error) {
            Logger.logError(error);
            throw error;
        }
    }

    async getUserCart(userId: number): Promise<Cart[]> {
        try {
            const url = `${this.BASE_PATH}/user/${userId}`;
            Logger.logRequest({
                url,
                method: 'GET',
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString()
            });

            const response = await axiosInstance.get<Cart[]>(url);

            Logger.logResponse({
                url,
                method: 'GET',
                requestHeaders: axiosInstance.defaults.headers as Record<string, string>,
                timestamp: new Date().toISOString(),
                status: response.status,
                responseBody: response.data,
                responseHeaders: response.headers as Record<string, string>,
                duration: 0,
                isSuccess: true
            });

            return response.data;
        } catch (error) {
            Logger.logError(error);
            throw error;
        }
    }
} 