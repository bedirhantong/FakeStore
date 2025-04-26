import { create } from 'zustand';
import { Product } from '../api/types/product.types';
import { ProductService } from '../api/services/product.service';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await ProductService.getInstance().getAllProducts();
      console.log('Fetched products:', response.data.length);
      set({ products: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },
})); 