import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Config API
const API_URL = 'http://192.168.1.239:3001';
const API_VERSION = 'v1';

console.log('API Config:', { API_URL, API_VERSION }); // Debug log

// Xác định baseURL dựa trên platform và môi trường
const getBaseUrl = () => {
  if (__DEV__ && Platform.OS === 'android') {
    // Nếu dùng Android Emulator
    return API_URL.replace(/^http:\/\/[^:]+/, 'http://10.0.2.2');
  }
  return API_URL;
};

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: `${getBaseUrl()}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Thêm token vào header nếu có
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    // Xử lý lỗi response
    if (error.response) {
      // Lỗi từ server với status code
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Không nhận được response
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Không thể kết nối đến server' });
    } else {
      // Lỗi trong quá trình setup request
      console.error('Error:', error.message);
      return Promise.reject({ message: 'Đã có lỗi xảy ra, vui lòng thử lại' });
    }
  }
);

export default api; 