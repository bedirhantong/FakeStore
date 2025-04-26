import axios from 'axios';
import { setupRequestInterceptor } from '../interceptors/request.interceptor';
import { setupResponseInterceptor } from '../interceptors/response.interceptor';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: 'https://fakestoreapi.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Setup interceptors
setupRequestInterceptor(axiosInstance);
setupResponseInterceptor(axiosInstance);

export default axiosInstance; 