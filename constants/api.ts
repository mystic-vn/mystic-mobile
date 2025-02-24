import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Xác định baseURL dựa trên platform và môi trường
const getBaseUrl = () => {
  // Sử dụng IP thực của máy trong mạng LAN
  const LOCAL_IP = '192.168.1.6'; // IP máy thật trong mạng LAN
  const API_PORT = '3001';

  if (__DEV__) {
    // Cho iOS
    if (Platform.OS === 'ios') {
      // Simulator dùng localhost
      if (process.env.EXPO_PUBLIC_USE_LOCALHOST === 'true') {
        return `http://localhost:${API_PORT}`;
      }
      // Thiết bị thật dùng IP LAN
      return `http://${LOCAL_IP}:${API_PORT}`;
    }
    
    // Cho Android (luôn dùng IP LAN cho cả emulator và thiết bị thật)
    return `http://${LOCAL_IP}:${API_PORT}`;
  }
  
  // Cho production environment
  return `https://api.mystic.vn`; // Thay đổi thành domain thật khi deploy
};

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Log request trong development
      if (__DEV__) {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          baseURL: config.baseURL,
          platform: Platform.OS,
        });
      }

      // Thêm token vào header nếu có
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Thêm device info vào header
      config.headers['X-Platform'] = Platform.OS;
      config.headers['X-App-Version'] = '1.0.0'; // Thay bằng version thật của app

      return config;
    } catch (error) {
      console.error('Request Setup Error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response trong development
    if (__DEV__) {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        platform: Platform.OS,
      });
    }
    return response.data;
  },
  (error) => {
    // Xử lý lỗi response
    if (error.response) {
      // Lỗi từ server với status code
      if (error.response.status === 401) {
        // Xử lý lỗi unauthorized
        console.error('Auth Error:', {
          url: error.config?.url,
          status: error.response.status,
          message: error.response.data?.message,
        });
        // Có thể thêm logic xử lý token hết hạn ở đây
        return Promise.reject({
          message: 'Thông tin đăng nhập không chính xác',
          code: 'AUTH_ERROR',
        });
      }

      console.error('API Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        platform: Platform.OS,
      });
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Không nhận được response
      console.error('Network Error:', {
        url: error.config?.url,
        message: error.message,
        code: error.code,
        platform: Platform.OS,
        baseURL: error.config?.baseURL,
      });
      return Promise.reject({ 
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.',
        code: 'NETWORK_ERROR',
      });
    } else {
      // Lỗi trong quá trình setup request
      console.error('Setup Error:', error.message);
      return Promise.reject({ 
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        code: 'UNKNOWN_ERROR',
      });
    }
  }
);

export default api; 