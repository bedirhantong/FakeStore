import axiosInstance from '../config/axios.config';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
    private static instance: AuthService;
    private readonly AUTH_TOKEN_KEY = '@auth_token';
    private readonly USER_DATA_KEY = '@user_data';
    private readonly BASE_PATH = '/auth';
    private readonly USERS_PATH = '/users';

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
        const loginResponse = await axiosInstance.post<AuthResponse>(`${this.BASE_PATH}/login`, credentials);
        
        if (loginResponse.data.token) {
            await this.saveToken(loginResponse.data.token);
        }

        const users = await this.getAllUsers();
        const user = users.find(u => u.username === credentials.username);
        
        if (!user) {
            throw new Error('User not found');
        }

        await this.saveUserData(user);

        return {
            token: loginResponse.data.token,
            user
        };
    }

    async signup(credentials: SignupCredentials): Promise<User> {
        const response = await axiosInstance.post<User>(this.USERS_PATH, {
            email: credentials.email,
            username: credentials.username,
            password: credentials.password,
            name: {
                firstname: '',
                lastname: ''
            },
            address: {
                city: '',
                street: '',
                number: 0,
                zipcode: '',
                geolocation: {
                    lat: '',
                    long: ''
                }
            },
            phone: ''
        });
        return response.data;
    }

    async logout(): Promise<void> {
        await AsyncStorage.removeItem(this.AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(this.USER_DATA_KEY);
        axiosInstance.defaults.headers.common['Authorization'] = '';
    }

    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(this.AUTH_TOKEN_KEY);
    }

    async getUserData(): Promise<User | null> {
        const userData = await AsyncStorage.getItem(this.USER_DATA_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    async getUserById(id: number): Promise<User> {
        const response = await axiosInstance.get<User>(`${this.USERS_PATH}/${id}`);
        return response.data;
    }

    private async saveToken(token: string): Promise<void> {
        await AsyncStorage.setItem(this.AUTH_TOKEN_KEY, token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    private async saveUserData(user: User): Promise<void> {
        await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    }

    async getAllUsers(): Promise<User[]> {
        const response = await axiosInstance.get<User[]>(this.USERS_PATH);
        return response.data;
    }
} 