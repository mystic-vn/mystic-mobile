import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const menuItems = [
    {
      id: 1,
      title: 'Thông tin cá nhân',
      icon: 'person.fill',
      color: '#9f7aea',
    },
    {
      id: 2,
      title: 'Lịch sử tra cứu',
      icon: 'clock.fill',
      color: '#9f7aea',
    },
    {
      id: 3,
      title: 'Bài viết đã lưu',
      icon: 'bookmark.fill',
      color: '#9f7aea',
    },
    {
      id: 4,
      title: 'Cài đặt',
      icon: 'gearshape.fill',
      color: '#9f7aea',
    },
    {
      id: 5,
      title: 'Điều khoản sử dụng',
      icon: 'doc.text.fill',
      color: '#9f7aea',
    },
    {
      id: 6,
      title: 'Chính sách bảo mật',
      icon: 'lock.fill',
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
        <ThemedText style={styles.name}>Nguyễn Văn A</ThemedText>
        <ThemedText style={styles.email}>example@email.com</ThemedText>
        
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
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <IconSymbol name={item.icon} size={24} color={item.color} />
            <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
            <IconSymbol name="chevron.right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton}>
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