import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Load user data khi màn hình được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  // Load user data lần đầu mount
  useEffect(() => {
    checkAuth();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      await loadUserData();
    } catch (error) {
      console.error('Error loading user:', error);
      router.replace('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuPress = (id: number) => {
    switch (id) {
      case 1: // Thông tin cá nhân
        router.push('/profile/edit');
        break;
      case 5: // Điều khoản sử dụng
        router.push('/profile/terms');
        break;
      case 6: // Chính sách bảo mật
        router.push('/profile/privacy');
        break;
      // Có thể thêm các case khác cho các menu item khác
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  const menuItems = [
    {
      id: 1,
      title: 'Thông tin cá nhân',
      icon: 'person.fill' as const,
      color: '#9f7aea',
    },
    {
      id: 2,
      title: 'Lịch sử tra cứu',
      icon: 'clock.arrow.circlepath' as const,
      color: '#9f7aea',
    },
    {
      id: 3,
      title: 'Bài viết đã lưu',
      icon: 'bookmark.fill' as const,
      color: '#9f7aea',
    },
    {
      id: 4,
      title: 'Cài đặt',
      icon: 'gear.circle.fill' as const,
      color: '#9f7aea',
    },
    {
      id: 5,
      title: 'Điều khoản sử dụng',
      icon: 'doc.text.fill' as const,
      color: '#9f7aea',
    },
    {
      id: 6,
      title: 'Chính sách bảo mật',
      icon: 'shield.fill' as const,
      color: '#9f7aea',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4a2b7e', '#2d1b4f']} style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.avatar}
        />
        <ThemedText style={styles.name}>
          {user ? `${user.lastName} ${user.firstName}` : ''}
        </ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
        
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>28</ThemedText>
            <ThemedText style={styles.statLabel}>Lần tra cứu</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>12</ThemedText>
            <ThemedText style={styles.statLabel}>Bài đã lưu</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>5</ThemedText>
            <ThemedText style={styles.statLabel}>Khóa học</ThemedText>
          </ThemedView>
        </ThemedView>
      </LinearGradient>

      <ThemedView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.id)}
          >
            <IconSymbol name={item.icon} size={24} color={item.color} />
            <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <IconSymbol name="arrow.right.circle.fill" size={24} color="#ff4757" />
        <ThemedText style={styles.logoutText}>Đăng xuất</ThemedText>
      </TouchableOpacity>
    </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    lineHeight: 30
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    marginLeft: 10,
    fontWeight: 'bold',
  },
}); 