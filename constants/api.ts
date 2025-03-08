import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Xác định baseURL dựa trên platform và môi trường
const baseURL = Platform.select({
  ios: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.39:3001',
  android: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.39:3001',
  default: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.39:3001',
});

const api = axios.create({
  baseURL: `${baseURL}`,
  timeout: 600000,
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const token = await AsyncStorage.getItem('access_token');
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

// Response interceptor - xử lý lỗi và refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về response.data thay vì toàn bộ response
    return response.data;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // Log error details để debug
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // Gọi API refresh token
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        // Lưu token mới
        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);

        // Cập nhật token cho request gốc và thử lại
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, xóa token và điều hướng về trang đăng nhập
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        await AsyncStorage.removeItem('user');
        console.error('Token refresh failed. Please login again.');
      }
    }

    return Promise.reject(error);
  }
);

// Tạo kiểu mới cho instance axios
type ApiInstance = {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
};

// Cast instance axios sang kiểu mới
const typedApi = api as unknown as ApiInstance;

export default typedApi; 