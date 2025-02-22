import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import api from '@/constants/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export default function EditProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const response = await api.put<any, User>('/users/me', formData);
      
      // Cập nhật thông tin user trong AsyncStorage
      const updatedUser = { ...user, ...response };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      router.back();
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header cố định */}
      <View style={styles.stickyHeader}>
        <LinearGradient colors={['#4a2b7e', '#2d1b4f']} style={styles.header}>
          <ThemedView style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText style={styles.title}>Thông tin cá nhân</ThemedText>
          </ThemedView>
        </LinearGradient>
      </View>

      {/* Phần nội dung có thể cuộn */}
      <ScrollView style={styles.scrollContent}>
        <ThemedView style={styles.formContainer}>
          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedTextInput
              value={user?.email}
              editable={false}
              style={[styles.input, styles.disabledInput]}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Họ</ThemedText>
            <ThemedTextInput
              value={formData.lastName}
              onChangeText={(value) => handleChange('lastName', value)}
              style={styles.input}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Tên</ThemedText>
            <ThemedTextInput
              value={formData.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
              style={styles.input}
            />
          </ThemedView>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <ThemedText style={styles.saveButtonText}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 30,
  },
  scrollContent: {
    flex: 1,
    marginTop: 120, // Để tránh bị che bởi header
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  disabledInput: {
    opacity: 0.7,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  saveButton: {
    backgroundColor: '#9f7aea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4757',
    textAlign: 'center',
    marginBottom: 15,
  },
}); 