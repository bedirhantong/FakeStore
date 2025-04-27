export interface CartProduct {
    productId: number;
    quantity: number;
}

export interface Cart {
    id: number;
    userId: number;
    date: string;
    products: CartProduct[];
}

export interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    error: string | null;
} 