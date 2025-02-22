import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Xác định baseURL dựa trên platform và môi trường
const getBaseUrl = () => {
  // Sử dụng IP thực của máy trong mạng LAN
  const LOCAL_IP = '192.168.1.6';
  const API_PORT = '3001';

  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Nếu dùng Android Emulator
      return `http://10.0.2.2:${API_PORT}`;
    }
    // Cho cả iOS và thiết bị thật
    return `http://${LOCAL_IP}:${API_PORT}`;
  }
  
  // Cho production (có thể thay đổi sau)
  return `http://${LOCAL_IP}:${API_PORT}`;
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