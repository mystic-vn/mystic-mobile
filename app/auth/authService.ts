import * as SecureStore from 'expo-secure-store';
import api from '../../constants/api';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = (await api.post('/auth/login', {
      email,
      password,
    })) as unknown as LoginResponse;

    await this.saveTokens({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
    await SecureStore.setItemAsync('user', JSON.stringify(response.user));

    return response;
  }

  async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        const response = (await api.post('/auth/refresh', {
          refresh_token: refreshToken,
        })) as unknown as AuthTokens;

        await this.saveTokens(response);
        return response.access_token;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async saveTokens(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync('access_token', tokens.access_token);
    await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
  }

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync('access_token');
  }

  async logout(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync('access_token'),
      SecureStore.deleteItemAsync('refresh_token'),
      SecureStore.deleteItemAsync('user'),
    ]);
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = await SecureStore.getItemAsync('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default AuthService.getInstance(); 