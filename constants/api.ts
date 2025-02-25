import axios, { InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Xác định baseURL dựa trên platform và môi trường
const baseURL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:3001',
  android: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:3001',
  default: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.6:3001',
});

const api = axios.create({
  baseURL: `${baseURL}`,
  timeout: 600000,
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request URL để debug
    console.log('Request URL:', `${config.baseURL}${config.url}`);
    return config;
  } catch (error: any) {
    console.error('Error in request interceptor:', error);
    return config;
  }
});

// Response interceptor - xử lý lỗi
api.interceptors.response.use(
  (response) => response.data,
  async (error: any) => {
    // Log error details để debug
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Nếu lỗi 401, xóa token và điều hướng về trang đăng nhập
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      // TODO: Điều hướng về trang đăng nhập
      console.error('Unauthorized access. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default api; 