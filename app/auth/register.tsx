import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import api from '@/constants/api';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      
      await api.post('/auth/register', formData);
      
      // Chuyển về trang đăng nhập sau khi đăng ký thành công
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={['#4a2b7e', '#2d1b4f']} style={styles.container}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        
        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.title}>Đăng ký tài khoản</ThemedText>
          
          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}

          <ThemedTextInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <ThemedTextInput
            placeholder="Họ"
            value={formData.lastName}
            onChangeText={(value) => handleChange('lastName', value)}
            style={styles.input}
          />

          <ThemedTextInput
            placeholder="Tên"
            value={formData.firstName}
            onChangeText={(value) => handleChange('firstName', value)}
            style={styles.input}
          />

          <ThemedTextInput
            placeholder="Mật khẩu"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            style={styles.linkButton}
          >
            <ThemedText style={styles.linkText}>
              Đã có tài khoản? Đăng nhập ngay
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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