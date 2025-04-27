import { create } from 'zustand';
import { CartState, Cart, CartProduct } from '../api/types/cart.types';
import { CartService } from '../api/services/cart.service';
import Logger from '../utils/logger';

interface CartStore extends CartState {
    createCart: (userId: number) => Promise<Cart>;
    getCart: (cartId: number) => Promise<void>;
    getUserCart: (userId: number) => Promise<void>;
    addToCart: (productId: number, quantity: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    initializeUserCart: (userId: number) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
    cart: null,
    isLoading: false,
    error: null,

    initializeUserCart: async (userId: number) => {
        try {
            Logger.logRequest({
                url: 'CartStore.initializeUserCart',
                method: 'ACTION',
                requestBody: { userId },
                requestHeaders: {},
                timestamp: new Date().toISOString()
            });

            set({ isLoading: true, error: null });
            const carts = await CartService.getInstance().getUserCart(userId);
            
            // Kullanıcının en son cart'ını al
            if (carts && carts.length > 0) {
                // En son tarihe göre sırala
                const sortedCarts = carts.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                set({ cart: sortedCarts[0], isLoading: false });

                Logger.logResponse({
                    url: 'CartStore.initializeUserCart',
                    method: 'ACTION',
                    requestBody: { userId },
                    requestHeaders: {},
                    timestamp: new Date().toISOString(),
                    status: 200,
                    responseBody: sortedCarts[0],
                    responseHeaders: {},
                    duration: 0,
                    isSuccess: true
                });
            } else {
                // Eğer cart yoksa yeni oluştur
                const newCart = await CartService.getInstance().createCart(userId);
                set({ cart: newCart, isLoading: false });

                Logger.logResponse({
                    url: 'CartStore.initializeUserCart',
                    method: 'ACTION',
                    requestBody: { userId },
                    requestHeaders: {},
                    timestamp: new Date().toISOString(),
                    status: 200,
                    responseBody: newCart,
                    responseHeaders: {},
                    duration: 0,
                    isSuccess: true
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to initialize cart';
            Logger.logError({
                message: errorMessage,
                action: 'CartStore.initializeUserCart',
                error
            });
            set({ 
                error: errorMessage,
                isLoading: false 
            });
            throw error;
        }
    },

    createCart: async (userId: number) => {
        try {
            Logger.logRequest({
                url: 'CartStore.createCart',
                method: 'ACTION',
                requestBody: { userId },
                requestHeaders: {},
                timestamp: new Date().toISOString()
            });

            set({ isLoading: true, error: null });
            const cart = await CartService.getInstance().createCart(userId);
            set({ cart, isLoading: false });

            Logger.logResponse({
                url: 'CartStore.createCart',
                method: 'ACTION',
                requestBody: { userId },
                requestHeaders: {},
                timestamp: new Date().toISOString(),
                status: 200,
                responseBody: cart,
                responseHeaders: {},
                duration: 0,
                isSuccess: true
            });

            return cart;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create cart';
            Logger.logError({
                message: errorMessage,
                action: 'CartStore.createCart',
                error
            });
            set({ 
                error: errorMessage,
                isLoading: false 
            });
            throw error;
        }
    },

    getCart: async (cartId: number) => {
        try {
            Logger.logRequest({
                url: 'CartStore.getCart',
                method: 'ACTION',
                requestBody: { cartId },
                requestHeaders: {},
                timestamp: new Date().toISOString()
            });

            set({ isLoading: true, error: null });
            const cart = await CartService.getInstance().getCartById(cartId);
            set({ cart, isLoading: false });

            Logger.logResponse({
                url: 'CartStore.getCart',
                method: 'ACTION',
                requestBody: { cartId },
                requestHeaders: {},
                timestamp: new Date().toISOString(),
                status: 200,
                responseBody: cart,
                responseHeaders: {},
                duration: 0,
                isSuccess: true
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get cart';
            Logger.logError({
                message: errorMessage,
                action: 'CartStore.getCart',
                error
            });
            set({ 
                error: errorMessage,
                isLoading: false 
            });
            throw error;
        }
    },

    getUserCart: async (userId: number) => {
        try {
            Logger.logRequest({
                url: 'CartStore.getUserCart',
                method: 'ACTION',
                requestBody: { userId },
                requestHeaders: {},
                timestamp: new Date().toISOString()
            });

            set({ isLoading: true, error: null });
            const carts = await CartService.getInstance().getUserCart(userId);
            if (carts.length > 0) {
                set({ cart: carts[0], isLoading: false });
            } else {
                set({ cart: null, isLoading: false });
            }

            Logger.logResponse({
                url: 'CartStore.getUserCart',
                method: 'ACTION',
                requestBody: { userId },
                requestHeaders: {},
                timestamp: new Date().toISOString(),
                status: 200,
                responseBody: carts,
                responseHeaders: {},
                duration: 0,
                isSuccess: true
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get user cart';
            Logger.logError({
                message: errorMessage,
                action: 'CartStore.getUserCart',
                error
            });
            set({ 
                error: errorMessage,
                isLoading: false 
            });
            throw error;
        }
    },

    addToCart: async (productId: number, quantity: number) => {
        try {
            Logger.logRequest({
                url: 'CartStore.addToCart',
                method: 'ACTION',
                requestBody: { productId, quantity },
                requestHeaders: {},
                timestamp: new Date().toISOString()
            });

            const { cart } = get();
            if (!cart) {
                throw new Error('No active cart found');
            }

            const updatedProducts = [...(cart.products || [])];
            const existingProductIndex = updatedProducts.findIndex(p => p.productId === productId);

            if (existingProductIndex !== -1) {
                updatedProducts[existingProductIndex].quantity += quantity;
            } else {
                updatedProducts.push({ productId, quantity });
            }

            const updatedCart = await CartService.getInstance().updateCart(cart.id, updatedProducts);
            set({ cart: updatedCart });

            Logger.logResponse({
                url: 'CartStore.addToCart',
                method: 'ACTION',
                requestBody: { productId, quantity, cartId: cart.id },
                requestHeaders: {},
                timestamp: new Date().toISOString(),
                status: 200,
                responseBody: updatedCart,
                responseHeaders: {},
                duration: 0,
                isSuccess: true
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
            Logger.logError({
                message: errorMessage,
                action: 'CartStore.addToCart',
                error
            });
            set({ error: errorMessage });
            throw error;
        }
    },

    updateQuantity: async (productId: number, quantity: number) => {
        try {
            Logger.logRequest({
                url: 'CartStore.updateQuantity',
                method: 'ACTION',
                requestBody: { productId, quantity },
                requestHeaders: {},
                timestamp: new Date().toISOString()
            });

            const { cart } = get();
            if (!cart) {
                throw new Error('No active cart found');
            }

            const updatedProducts = [...(cart.products || [])];
            const existingProductIndex = updatedProducts.findIndex(p => p.productId === productId);

            if (existingProductIndex !== -1) {
                if (quantity <= 0) {
                    updatedProducts.splice(existingProductIndex, 1);
                } else {
                    updatedProducts[existingProductIndex].quantity = quantity;
                }

                const updatedCart = await CartService.getInstance().updateCart(cart.id, updatedProducts);
                set({ cart: updatedCart });

                Logger.logResponse({
                    url: 'CartStore.updateQuantity',
                    method: 'ACTION',
                    requestBody: { productId, quantity, cartId: cart.id },
                    requestHeaders: {},
                    timestamp: new Date().toISOString(),
                    status: 200,
                    responseBody: updatedCart,
                    responseHeaders: {},
                    duration: 0,
                    isSuccess: true
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
            Logger.logError({
                message: errorMessage,
                action: 'CartStore.updateQuantity',
                error
            });
            set({ error: errorMessage });
            throw error;
        }
    },

    removeFromCart: async (productId: number) => {
        try {
            Logger.logRequest({
                url: 'CartStore.removeFromCart',
                method: 'ACTION',
                requestBody: { productId },
                requestHeaders: {},
                timestamp: new Date().toISOString()
            });

            const { cart } = get();
            if (!cart) {
                throw new Error('No active cart found');
            }

            const updatedProducts = cart.products.filter(p => p.productId !== productId);
            const updatedCart = await CartService.getInstance().updateCart(cart.id, updatedProducts);
            set({ cart: updatedCart });

            Logger.logResponse({
                url: 'CartStore.removeFromCart',
                method: 'ACTION',
                requestBody: { productId, cartId: cart.id },
                requestHeaders: {},
                timestamp: new Date().toISOString(),
                status: 200,
                responseBody: updatedCart,
                responseHeaders: {},
                duration: 0,
                isSuccess: true
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to remove from cart';
            Logger.logError({
                message: errorMessage,
                action: 'CartStore.removeFromCart',
                error
            });
            set({ error: errorMessage });
            throw error;
        }
    },
})); 