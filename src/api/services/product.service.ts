import axiosInstance from '../config/axios.config';
import { Product, ApiResponse } from '../types/product.types';

export class ProductService {
    private static instance: ProductService;
    private readonly BASE_PATH = '/products';

    private constructor() {}

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    async getAllProducts(): Promise<ApiResponse<Product[]>> {
        const response = await axiosInstance.get<Product[]>(this.BASE_PATH);
        return {
            data: response.data,
            status: response.status,
            message: 'Products fetched successfully'
        };
    }

    async getProductById(id: number): Promise<ApiResponse<Product>> {
        const response = await axiosInstance.get<Product>(`${this.BASE_PATH}/${id}`);
        return {
            data: response.data,
            status: response.status,
            message: 'Product fetched successfully'
        };
    }

    async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
        const response = await axiosInstance.get<Product[]>(`${this.BASE_PATH}/category/${category}`);
        return {
            data: response.data,
            status: response.status,
            message: 'Products fetched successfully'
        };
    }
} 