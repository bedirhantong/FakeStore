export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    email: string;
}

export interface AuthResponse {
    token: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    name?: {
        firstname: string;
        lastname: string;
    };
    phone?: string;
    address?: {
        geolocation: {
            lat: string;
            long: string;
        };
        city: string;
        street: string;
        number: number;
        zipcode: string;
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    userId: number | null;
    isLoading: boolean;
    error: string | null;
} 