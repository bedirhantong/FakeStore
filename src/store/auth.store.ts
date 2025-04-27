import { create } from 'zustand';
import { AuthState, LoginCredentials, SignupCredentials, User } from '../api/types/auth.types';
import { AuthService } from '../api/services/auth.service';
import { Alert } from 'react-native';

interface AuthStore extends AuthState {
    login: (credentials: LoginCredentials) => Promise<{ token: string; user: User }>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    fetchUserDetails: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    userId: null,
    isLoading: false,
    error: null,

    login: async (credentials) => {
        try {
            set({ isLoading: true, error: null });
            const response = await AuthService.getInstance().login(credentials);
            const { token, user } = response;
            set({ 
                token,
                user,
                userId: user.id,
                isLoading: false 
            });
            return response;
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Login failed', 
                isLoading: false 
            });
            throw error;
        }
    },

    signup: async (credentials) => {
        try {
            set({ isLoading: true, error: null });
            const user = await AuthService.getInstance().signup(credentials);
            set({ user, isLoading: false });
            // Signup başarılı olduğunda kullanıcıyı login ekranına yönlendireceğiz
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Signup failed', 
                isLoading: false 
            });
            throw error;
        }
    },

    fetchUserDetails: async () => {
        try {
            set({ isLoading: true, error: null });
            const { userId } = useAuthStore.getState();
            if (!userId) {
                throw new Error('No user ID found');
            }
            const user = await AuthService.getInstance().getUserById(userId);
            set({ user, isLoading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Failed to fetch user details', 
                isLoading: false 
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true, error: null });
            await AuthService.getInstance().logout();
            set({ 
                user: null, 
                token: null, 
                userId: null, 
                isLoading: false 
            });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'Logout failed', 
                isLoading: false 
            });
            throw error;
        }
    },

    checkAuth: async () => {
        try {
            const token = await AuthService.getInstance().getToken();
            if (token) {
                const userData = await AuthService.getInstance().getUserData();
                set({ 
                    token, 
                    user: userData,
                    userId: userData?.id || null,
                    isLoading: false 
                });
            } else {
                set({ token: null, isLoading: false });
            }
        } catch (error) {
            set({ error: null, token: null, isLoading: false });
        }
    },
})); 