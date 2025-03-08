import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import api from '@/constants/api';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.post<any, LoginResponse>('/auth/login', {
        email,
        password,
      });
      
      await Promise.all([
        AsyncStorage.setItem('access_token', response.access_token),
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
        AsyncStorage.setItem('userId', response.user.id)
      ]);
      
      router.replace('/(tabs)/profile');
    } catch (err: any) {
      console.log('Login error:', err);
      setError(err.message || 'Thông tin đăng nhập không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4a2b7e', '#2d1b4f']} style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
      />
      
      <ThemedView style={styles.formContainer}>
        <ThemedText style={styles.title}>Đăng nhập</ThemedText>
        
        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}

        <ThemedTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <ThemedTextInput
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/register')}
          style={styles.linkButton}
        >
          <ThemedText style={styles.linkText}>
            Chưa có tài khoản? Đăng ký ngay
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#9f7aea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#9f7aea',
    fontSize: 14,
  },
  errorText: {
    color: '#ff4757',
    textAlign: 'center',
    marginBottom: 15,
  },
}); 