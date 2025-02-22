import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SupportScreen() {
  const supportItems = [
    {
      id: 1,
      title: 'Hướng dẫn sử dụng',
      description: 'Cách sử dụng các tính năng của ứng dụng',
      icon: 'book.fill',
      colors: ['#4a2b7e', '#2d1b4f'],
    },
    {
      id: 2,
      title: 'Câu hỏi thường gặp',
      description: 'Giải đáp các thắc mắc phổ biến',
      icon: 'questionmark.circle.fill',
      colors: ['#7e2b5e', '#4f1b3d'],
    },
    {
      id: 3,
      title: 'Liên hệ hỗ trợ',
      description: 'Gửi yêu cầu hỗ trợ trực tiếp',
      icon: 'envelope.fill',
      colors: ['#2b7e6f', '#1b4f46'],
    },
    {
      id: 4,
      title: 'Cộng đồng',
      description: 'Tham gia cộng đồng Mystic',
      icon: 'person.2.fill',
      colors: ['#7e612b', '#4f3d1b'],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Hỗ Trợ</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Chúng tôi luôn sẵn sàng giúp đỡ bạn</ThemedText>
      </ThemedView>

      <ThemedView style={styles.supportContainer}>
        {supportItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.supportCard}>
            <LinearGradient colors={item.colors} style={styles.supportGradient}>
              <IconSymbol name={item.icon} size={32} color="#fff" />
              <ThemedText style={styles.supportTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.supportDesc}>{item.description}</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.contactSection}>
        <ThemedText style={styles.contactTitle}>Liên hệ trực tiếp</ThemedText>
        <ThemedText style={styles.contactInfo}>Email: support@mystic.vn</ThemedText>
        <ThemedText style={styles.contactInfo}>Hotline: 1900 xxxx</ThemedText>
        <ThemedText style={styles.contactTime}>Thời gian hỗ trợ: 9:00 - 18:00</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    lineHeight: 80,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  supportContainer: {
    padding: 15,
  },
  supportCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  supportGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
    flex: 1,
  },
  supportDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 15,
    flex: 1,
  },
  contactSection: {
    padding: 20,
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  contactInfo: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  contactTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 10,
  },
}); 