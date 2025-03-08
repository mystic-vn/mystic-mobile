import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Route } from 'expo-router/build/types';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import historyEndpoints, { UserStats } from '@/constants/endpoints/history';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

type MenuItem = {
  id: number;
  title: string;
  icon: 'person.fill' | 'clock.arrow.circlepath' | 'bookmark.fill' | 'gear.circle.fill' | 'doc.text.fill' | 'shield.fill';
  color: string;
  route: Route;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
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
      setLoading(true);
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Load user stats
        console.log('Loading stats for user:', userData.id);
        const userStats = await historyEndpoints.getUserStats(userData.id);
        console.log('Loaded user stats:', userStats);
        
        if (!userStats) {
          console.error('No stats returned from API');
          return;
        }
        
        setStats(userStats);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Hiển thị thông báo lỗi
      alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
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
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'user', 'userId']);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuPress = (route: Route) => {
    router.push(route);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Thông tin cá nhân',
      icon: 'person.fill',
      color: '#9f7aea',
      route: '/profile/edit' as Route,
    },
    {
      id: 2,
      title: 'Lịch sử tra cứu',
      icon: 'clock.arrow.circlepath',
      color: '#9f7aea',
      route: '/profile/history' as Route,
    },
    {
      id: 3,
      title: 'Bài viết đã lưu',
      icon: 'bookmark.fill',
      color: '#9f7aea',
      route: '/profile/saved' as Route,
    },
    {
      id: 4,
      title: 'Cài đặt',
      icon: 'gear.circle.fill',
      color: '#9f7aea',
      route: '/profile/settings' as Route,
    },
    {
      id: 5,
      title: 'Điều khoản sử dụng',
      icon: 'doc.text.fill',
      color: '#9f7aea',
      route: '/profile/terms' as Route,
    },
    {
      id: 6,
      title: 'Chính sách bảo mật',
      icon: 'shield.fill',
      color: '#9f7aea',
      route: '/profile/privacy' as Route,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient 
        colors={['#2D1B69', '#4A1B6D', '#1F1135']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlow} />
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.avatar}
          />
        </View>
        <ThemedText style={styles.name}>
          {user ? `${user.lastName} ${user.firstName}` : ''}
        </ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
        
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {stats?.tarot.readingCount || 0}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Tarot</ThemedText>
          </ThemedView>
          <View style={styles.statDivider} />
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {stats?.numerology.readingCount || 0}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Thần số học</ThemedText>
          </ThemedView>
          <View style={styles.statDivider} />
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {stats?.zodiac.readingCount || 0}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Cung hoàng đạo</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={[styles.statsContainer, { marginTop: 12 }]}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {stats?.tarot.favoriteCount || 0}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Yêu thích</ThemedText>
          </ThemedView>
          <View style={styles.statDivider} />
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
            onPress={() => handleMenuPress(item.route)}
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(159,122,234,0.2)',
    top: -5,
    left: -5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(159,122,234,0.3)',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 30,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9f7aea',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(159,122,234,0.15)',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(159,122,234,0.2)',
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
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.2)',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    marginLeft: 10,
    fontWeight: 'bold',
  },
}); 