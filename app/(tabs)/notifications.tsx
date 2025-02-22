import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: 'Lá bài Tarot hôm nay của bạn đã sẵn sàng',
      time: '1 giờ trước',
      type: 'tarot',
      read: false,
    },
    {
      id: 2,
      title: 'Dự đoán chiêm tinh tuần mới',
      time: '3 giờ trước',
      type: 'astrology',
      read: false,
    },
    {
      id: 3,
      title: 'Khóa học Thần số học đã được cập nhật',
      time: '1 ngày trước',
      type: 'numerology',
      read: true,
    },
    {
      id: 4,
      title: 'Thông điệp Oracle mới',
      time: '2 ngày trước',
      type: 'oracle',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tarot':
        return 'sparkles';
      case 'astrology':
        return 'star.fill';
      case 'numerology':
        return 'number.circle.fill';
      case 'oracle':
        return 'moon.stars.fill';
      default:
        return 'bell.fill';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Thông Báo</ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.markAllRead}>Đánh dấu tất cả đã đọc</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationCard, notification.read && styles.notificationRead]}>
            <IconSymbol
              name={getNotificationIcon(notification.type)}
              size={24}
              color={notification.read ? '#666' : '#9f7aea'}
            />
            <ThemedView style={styles.notificationContent}>
              <ThemedText
                style={[styles.notificationTitle, notification.read && styles.notificationTitleRead]}>
                {notification.title}
              </ThemedText>
              <ThemedText style={styles.notificationTime}>{notification.time}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 80,
  },
  markAllRead: {
    fontSize: 14,
    color: '#9f7aea',
  },
  notificationsContainer: {
    padding: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(159, 122, 234, 0.1)',
    borderRadius: 12,
    marginBottom: 10,
  },
  notificationRead: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  notificationContent: {
    marginLeft: 15,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  notificationTitleRead: {
    color: '#666',
  },
  notificationTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
}); 